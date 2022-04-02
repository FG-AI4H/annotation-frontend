import * as React from 'react';

import AppNavbar from "./AppNavbar";
import {Button, Container, Grid, Paper} from "@mui/material";
import {ociStyles} from "./customStyle";
import {Link as RouterLink} from "react-router-dom";


export default function DataStoreHome(props) {
    const classes = ociStyles();

    return (

        <div>
            <AppNavbar/>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    {/* Datasets */}
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            
                        </Paper>
                    </Grid>
                </Grid>
                <div className="container">
                    <Button component={RouterLink} color="secondary" to={"/admin"}>Back</Button>
                </div>
            </Container>
        </div>

    );
}
