import React from "react";
import AppNavbar from "./AppNavbar";

import UserListComponent from "./components/UserListComponent";
import {Container, Grid, Paper} from "@mui/material";


const UserList = () => {


    return (
        <div>
            <AppNavbar/>
            <Container maxWidth="lg" >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper>
                            <UserListComponent title="Users"/>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );

}
export default UserList;
