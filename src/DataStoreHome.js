import * as React from 'react';

import AppNavbar from "./AppNavbar";
import {Box, Button, Container, Grid, IconButton, Paper} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import Datasets from "./Datasets";
import {Replay} from "@mui/icons-material";


export default function DataStoreHome(props) {

    return (

        <div>
            <AppNavbar/>
            <Container maxWidth="xl" sx={{ mt: 5 }}>
                <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => this.componentDidMount()}><Replay /></IconButton>{' '}
                    <Button component={RouterLink} color="success" to={"/campaigns/new"}>Add Dataset</Button>
                </Box>
                <h3>Datasets</h3>

                <Grid container spacing={3}>
                    {/* Datasets */}
                    <Grid item xs={12}>
                        <Paper >
                            <Datasets datasets = {props.datasets}/>
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
