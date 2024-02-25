import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Modal,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Link as RouterLink} from "react-router-dom";
import {style} from "../Datasets";
import {Auth} from "aws-amplify";
import {Check} from "@mui/icons-material";
import DatasetClient from "../api/DatasetClient";
import CampaignClient from "../api/CampaignClient";
import Alert from "@mui/material/Alert";
import PropTypes from 'prop-types';

const CampaignDataset = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [open, setOpen] = useState(false);
    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState([]);
    const [campaign, setCampaign] = useState(props.campaign);

    useEffect(() => {
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(currentUser => {
            const client = new DatasetClient(currentUser.signInUserSession.accessToken.jwtToken);
            client.fetchDatasetList()
                .then(
                    response => {
                        setDatasets(response?.data)
                        let updatedDatasets = [...(response ? response.data : undefined)].filter(i => i.id === props.datasetsUUID);
                        setSelectedDatasets(updatedDatasets);
                    })

        }).catch(err => console.log(err));
    }, [])


    //Open "Add / Edit Dataset" modal
    const handleModalOpen = async () => {
        setOpen(true)
    };

    //Close "Add / Edit Dataset" modal
    const handleModalClose = () => {
        setOpen(false);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        campaign.datasets = selectedDatasets.map(d => d.id);

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new CampaignClient(response.signInUserSession.accessToken.jwtToken);

            client.updateCampaign(campaign)
                .then(
                    response => setUpdated(true))

        }).catch(err => console.log(err));

    }

    function handleClose(event, reason){
        if (reason === 'clickaway') {
            return;
        }

        setUpdated(false);
    }

    const handleAddDataset = (dataset) => {
        let updatedList = [...selectedDatasets];
        updatedList.push(dataset);
        setSelectedDatasets(updatedList);
    }

    const removeSelectDataset = (dataset) => {
        let updatedDatasets = [...selectedDatasets].filter(i => i.id !== dataset.id);
        setSelectedDatasets(updatedDatasets);
    }

    const datatsetList = selectedDatasets.map(dataset => {
        return <TableRow key={dataset.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell style={{whiteSpace: 'nowrap'}}>{dataset.name}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{dataset.description}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{dataset.metadata.data_sample_size}</TableCell>
            <TableCell>
                <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                    <Button component={RouterLink} size="small" color="primary" to={"/datasets/" + dataset.id}>View</Button>
                    <Button size="small" color="error" onClick={() => removeSelectDataset(dataset)}>Remove</Button>
                </Stack>

            </TableCell>
        </TableRow>
    });

    return (
        <>
            <Snackbar open={updated} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}>
                <Alert severity="success" sx={{ width: '100%' }} onClose={handleClose}>
                    Campaign updated successfully!
                </Alert>
            </Snackbar>

            <Backdrop open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                <Button onClick={handleModalOpen} color="success">Add Dataset</Button>
            </Box>

            <h3>Selected datasets</h3>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell width={"30%"}>Name</TableCell>
                            <TableCell width={"40%"}>Description</TableCell>
                            <TableCell width={"20%"}>Size</TableCell>
                            <TableCell width={"10%"} align={"right"}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datatsetList}
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack direction="row" spacing={2}>
                <Button color="primary" onClick={e => handleSubmit(e)}>Save</Button>
                <Button component={RouterLink} color="secondary" to="/campaigns">Cancel</Button>
            </Stack>

            <Modal
                open={open}
                onClose={handleModalClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Available Datasets
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width="30%">Name</TableCell>
                                    <TableCell width="30%">Description</TableCell>
                                    <TableCell width="30%">Last Updated</TableCell>
                                    <TableCell width="10%" align={"right"}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {datasets.map((dataset) => (
                                    <TableRow key={dataset.id}>
                                        <TableCell>{dataset.name}</TableCell>
                                        <TableCell>{dataset.description}</TableCell>
                                        <TableCell>{(new Date(Date.parse(dataset.updatedAt))).toLocaleString(navigator.language)}</TableCell>
                                        <TableCell>
                                            <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                                                {selectedDatasets.filter(i => i.id === dataset.id).length === 0 ?
                                                    <Button size="small" color="primary" onClick={() => handleAddDataset(dataset)}>Add</Button>
                                                    :
                                                    <Check />
                                                }
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                        <Button variant="contained" onClick={handleModalClose}>Close</Button>

                    </Stack>


                </Box>
            </Modal>
        </>
    )
}

CampaignDataset.propTypes = {
    campaign: PropTypes.any,
    datasetsUUID: PropTypes.string,
};

export default CampaignDataset
