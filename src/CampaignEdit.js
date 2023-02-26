import React, {useEffect, useState} from 'react';
import AppNavbar from './AppNavbar';
import {Link as RouterLink, useParams} from 'react-router-dom';
import CampaignChart from "./CampaignChart";
import CampaignProgress from "./CampaignProgress";
import {Auth} from "aws-amplify";
import CampaignClient from "./api/CampaignClient";
import CampaignForm from "./components/CampaignForm";
import CampaignUsers from "./components/CampaignUsers";
import {Backdrop, Box, Button, CircularProgress, Container, Grid, Tab, Tabs, Typography} from "@mui/material";
import CampaignTask from "./components/CampaignTask";
import {TabPanel} from "./components/TabPanel";
import {a11yProps} from "./components/allyProps";
import CampaignDataset from "./components/CampaignDataset";

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

    const title = <h2>{item.campaignUUID ? 'Edit Campaign' : 'Add Campaign'}</h2>;


    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return <div>
        <AppNavbar/>
        <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <Container maxWidth="xl" sx={{ mt: 5 }}>
            {title}

            {item.campaignUUID &&

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    aria-label="wrapped label tabs example"
                    >
                        <Tab label="Progress" {...a11yProps(0)}/>
                        <Tab label="Settings" {...a11yProps(1)}/>
                        <Tab label="Datasets" {...a11yProps(2)}/>
                        <Tab label="Tasks" {...a11yProps(3)}/>
                    </Tabs>
                    </Box>
                    <TabPanel value={tabValue} index={0}>
                        <div className={'panel-wrapper'}>
                            <Typography gutterBottom variant="h5" component="div">Number of Annotations</Typography>
                            <CampaignChart/>
                            <div className={'panel-wrapper'}>
                                <Typography gutterBottom variant="h5" component="div">Campaign Progression</Typography>
                                <CampaignProgress/>
                            </div>
                            <Button component={RouterLink} color="secondary" to="/campaigns">Back</Button>
                        </div>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Grid item xs={12}>
                            <CampaignForm campaign={item}/>
                        </Grid>
                        <CampaignUsers campaign={item}/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <CampaignDataset datasets={item.datasets}/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <CampaignTask campaign={item}/>
                    </TabPanel>
                </Box>

            }
            {!item.campaignUUID &&
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
