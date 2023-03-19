import * as React from 'react';

import AppNavbar from "./AppNavbar";
import {Box, Button, Container, Grid, IconButton, Paper} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import Datasets from "./Datasets";
import {Replay} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {Auth} from "aws-amplify";
import DatasetClient from "./api/DatasetClient";


export default function DataStoreHome(_props) {

    const [datasets, setDatasets] = useState([])

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

    //Load at page load
    useEffect(() => {
        loadDataset();
    }, [])

    return (

        <div>
            <AppNavbar/>
            <Container maxWidth="xl" sx={{ mt: 5 }}>
                <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => loadDataset()}><Replay /></IconButton>{' '}
                    <Button component={RouterLink} color="success" to={"/datasets/new"}>Add Dataset</Button>
                </Box>
                <h3>Datasets</h3>

                <Grid container spacing={3}>
                    {/* Datasets */}
                    <Grid item xs={12}>
                        <Paper >
                            <Datasets datasets = {datasets}/>
                        </Paper>
                    </Grid>
                </Grid>
                <div className="container">
                    <Button component={RouterLink} color="secondary" to={"/"}>Back</Button>
                </div>
            </Container>
        </div>

    );
}
