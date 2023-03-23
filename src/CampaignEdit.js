import React, {useEffect, useState} from 'react';
import AppNavbar from './AppNavbar';
import {useParams} from 'react-router-dom';
import CampaignChart from "./CampaignChart";
import CampaignProgress from "./CampaignProgress";
import {Auth} from "aws-amplify";
import CampaignClient from "./api/CampaignClient";
import CampaignForm from "./components/CampaignForm";
import CampaignUsers from "./components/CampaignUsers";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import CampaignTask from "./components/CampaignTask";
import {TabPanel} from "./components/TabPanel";
import {a11yProps} from "./components/allyProps";
import CampaignDataset from "./components/CampaignDataset";
import Alert from "@mui/material/Alert";
import {Link as RouterLink} from "react-router-dom";

const CampaignEdit = () => {
    let params = useParams();

    const emptyItem = {
        name: '',
        description: '',
        annotators: [],
        reviewers: []
    };

    const [item, setItem] = useState(emptyItem);
    const [isLoading, setIsLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [updated, setUpdated] = useState(false);

    useEffect( () =>{
        setIsLoading(true);

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            if (params.id !== 'new') {
                const campaignClient = new CampaignClient(response.signInUserSession.accessToken.jwtToken);
                campaignClient.fetchCampaignById(params.id)
                    .then(
                        response => {
                            setIsLoading(false);
                            setItem(response?.data);
                        }
                    );
            }
            else {
                setIsLoading(false);
            }

        }).catch(err => console.log(err));

    }, [params.id])

    const title = <h2>{item.id ? 'Edit Campaign ('+item.status+')' : 'Add Campaign'}</h2>;


    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function handleClose(event, reason){
        if (reason === 'clickaway') {
            return;
        }

        setUpdated(false);
    }

    async function generateTasks(event) {
        event.preventDefault();

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new CampaignClient(response.signInUserSession.accessToken.jwtToken);

            client.generateTasks(item.id)
                .then(
                    response => setUpdated(true));

        }).catch(err => console.log(err));
    }

    async function startCampaign(event) {
        event.preventDefault();

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new CampaignClient(response.signInUserSession.accessToken.jwtToken);

            client.startCampaign(item.id)
                .then(
                    response => setUpdated(true));
            item.status = 'RUNNING';

        }).catch(err => console.log(err));

    }

    return <div>
        <AppNavbar/>
        <Snackbar open={updated} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}>
            <Alert severity="success" sx={{ width: '100%' }} onClose={handleClose}>
                Campaign updated successfully!
            </Alert>
        </Snackbar>
        <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <Container maxWidth="xl" sx={{ mt: 5 }}>
            {title}

            {item.id &&

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    aria-label="wrapped label tabs example"
                    >
                        <Tab label="Settings" {...a11yProps(0)}/>
                        <Tab label="Datasets" {...a11yProps(1)}/>
                        <Tab label="Tasks" {...a11yProps(2)}/>
                        <Tab label="Progress" {...a11yProps(3)}/>

                    </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <Grid item xs={12}>
                            <CampaignForm campaign={item}/>
                        </Grid>
                        <CampaignUsers campaign={item}/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <CampaignDataset campaign={item} datasetsUUID={item.datasets}/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <CampaignTask campaign={item}/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <div className={'panel-wrapper'}>

                            {item.status === 'RUNNING' &&
                                <>
                                < CampaignChart / >
                                <div className={'panel-wrapper'}>
                                    <CampaignProgress campaign={item}/>
                                </div>
                                </>
                                    }
                            {item.status === 'DRAFT' &&
                                <>
                                    <Typography gutterBottom variant="h6" component="div">The campaign has not started yet</Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Button color="info" onClick={e => generateTasks(e)}>Generate tasks</Button>
                                        <Button color="success" onClick={e => startCampaign(e)}>Start campaign</Button>
                                    </Stack>
                                </>

                            }
                        </div>
                    </TabPanel>
                                <Button component={RouterLink} color="secondary" to="/campaigns">Back</Button>
                </Box>

            }
            {!item.id &&
                <>
                    <Grid item xs={12}>
                        <CampaignForm campaign={item}/>
                    </Grid>
                </>

            }

        </Container>
    </div>
}
export default CampaignEdit;
