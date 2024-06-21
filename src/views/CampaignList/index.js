import React, {Component} from 'react';
import AppNavbar from '../../components/AppNavbar';
import {Auth} from "aws-amplify";
import CampaignClient from "../../api/CampaignClient";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";

import {Replay} from "@mui/icons-material";

class CampaignList extends Component {

    constructor(props) {
        super(props);
        this.state = {campaigns: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(currentUser => {
            const client = new CampaignClient(currentUser.signInUserSession.accessToken.jwtToken);
            client.fetchCampaignList()
                .then(
                    campaignListResponse =>
                        this.setState(
                            {campaigns: campaignListResponse?.data, isLoading: false}
                        ));
        }).catch(err => console.log(err));

    }

    async remove(id) {
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(currentUser => {
            const client = new CampaignClient(currentUser.signInUserSession.accessToken.jwtToken);
            client.removeCampaign(id)
                .then(
                    _response => {
                        let updatedCampaigns = [...this.state.campaigns].filter(i => i.id !== id);
                        this.setState({campaigns: updatedCampaigns});
                    });
        }).catch(err => console.log(err));

    }

    render() {
        const {campaigns, isLoading} = this.state;

        const campaignList = campaigns?.map(campaign => {
            return <TableRow key={campaign.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell style={{whiteSpace: 'nowrap'}}>{campaign.name}</TableCell>
                <TableCell>{campaign.description}</TableCell>
                <TableCell>{campaign.status}</TableCell>
                <TableCell>
                    <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                        <Button component={RouterLink} size="small" color="primary" to={"/campaigns/" + campaign.id}>Edit</Button>
                        <Button size="small" color="error" onClick={() => this.remove(campaign.id)}>Delete</Button>
                    </Stack>
                </TableCell>

            </TableRow>

        });

        return (
            <>
                <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Container maxWidth="xl" sx={{ mt: 5 }}>
                    <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => this.componentDidMount()}><Replay /></IconButton>{' '}
                        <Button component={RouterLink} color="success" to={"/campaigns/new"}>Add Campaign</Button>
                    </Box>

                    <h3>Campaigns</h3>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width="30%">Name</TableCell>
                                    <TableCell width="30%">Description</TableCell>
                                    <TableCell width="20%">Status</TableCell>
                                    <TableCell width="20%" align={"right"}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {campaignList?.length > 0 ? campaignList : <tr><td colSpan={5}>No campaign available</td></tr>
                                }
                            </TableBody>

                        </Table>
                    </TableContainer>

                   <Button component={RouterLink} color="secondary" to="/annotation">Back</Button>
                </Container>
            </>
        );
    }
}
export default CampaignList;
