import * as React from 'react';
import {useEffect, useState} from 'react';

import AppNavbar from "./AppNavbar";
import {Backdrop, Box, Button, CircularProgress, Container, Grid, IconButton, Paper, Tab, Tabs} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import Datasets from "./Datasets";
import {Replay} from "@mui/icons-material";
import {Auth} from "aws-amplify";
import DatasetClient from "./api/DatasetClient";
import {a11yProps} from "./components/allyProps";
import {TabPanel} from "./components/TabPanel";
import CatalogDatasets from "./CatalogDatasets";


export default function DataStoreHome(_props) {

    const [datasets, setDatasets] = useState([]);
    const [remoteDatasets, setRemoteDatasets] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    function loadDataset() {
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(currentUser => {
            const client = new DatasetClient(currentUser.signInUserSession.accessToken.jwtToken);
            client.fetchDatasetList()
                .then(
                    response => {
                        setDatasets(response?.data)
                    })

        }).catch(err => console.log(err));
    }

    function loadRemoteDataset() {
        setIsLoading(true);
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(currentUser => {
            const client = new DatasetClient(currentUser.signInUserSession.accessToken.jwtToken);
            client.fetchCatalogDatasetList()
                .then(
                    response => {
                        setRemoteDatasets(response?.data)
                        setIsLoading(false)
                    })

        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        });
    }

    //Load at page load
    useEffect(() => {
        loadDataset();
        loadRemoteDataset();
    }, [])

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function Item(props: BoxProps) {
        const { sx, ...other } = props;
        return (
            <Box
                sx={{
                    p: 1,
                    m: 1,
                    ...sx,
                }}
                {...other}
            />
        );
    }


    return (

        <div>
            <AppNavbar/>

            <Container maxWidth="xl" sx={{ mt: 5 }}>
                <Box sx={{ display: 'flex' }}>
                    <Item sx={{ flexGrow: 1 }}><h2>Datasets</h2></Item>
                    <Item >
                        <IconButton onClick={() => loadDataset()}><Replay /></IconButton>{' '}
                        <Button component={RouterLink} color="info" to={"/datasets/link"}>Link Dataset</Button>
                        <Button component={RouterLink} color="success" to={"/datasets/new"}>Add Dataset</Button>
                    </Item>
                </Box>



                <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        aria-label="wrapped label tabs example"
                    >
                        <Tab label="Registered Datasets" {...a11yProps(0)}/>
                        <Tab label="Available Datasets" {...a11yProps(1)}/>

                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>

                    <Grid container spacing={3}>
                        {/* Datasets */}
                        <Grid item xs={12}>
                            <Paper >
                                <Datasets datasets = {datasets}/>
                            </Paper>
                        </Grid>
                    </Grid>

                </TabPanel>

                <TabPanel value={tabValue} index={1}>

                    <Grid container spacing={3}>
                        {/* Datasets */}
                        <Grid item xs={12}>
                            <Paper >
                                <CatalogDatasets datasets = {remoteDatasets} isLoading = {isLoading}/>
                            </Paper>
                        </Grid>
                    </Grid>

                </TabPanel>
            </Box>
                <div className="container">
                    <Button component={RouterLink} color="secondary" to={"/"}>Back</Button>
                </div>
            </Container>
        </div>

    );
}
