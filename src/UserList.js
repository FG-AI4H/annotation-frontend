import React from "react";
import AppNavbar from "./AppNavbar";

import UserListComponent from "./components/UserListComponent";
import {Container, Grid, Paper} from "@mui/material";
import {ociStyles} from "./customStyle";


const UserList = () => {

    const classes = ociStyles();

    return (
        <div>
            <AppNavbar/>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <UserListComponent title="Users"/>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );

}
export default UserList;
