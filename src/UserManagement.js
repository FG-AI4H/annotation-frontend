import React, {Component} from "react";
import {Link as RouterLink} from "react-router-dom";
import {Box, Button, Container, Grid, IconButton, Paper} from "@mui/material";
import AppNavbar from "./AppNavbar";
import {Replay} from "@mui/icons-material";
import UserListComponent from "./components/UserListComponent";

class UserManagement extends Component {

    render() {
        return (

            <div>
                <AppNavbar/>
                <Container maxWidth="xl" sx={{ mt: 5 }}>
                    <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => this.componentDidMount()}><Replay /></IconButton>{' '}
                        <Button component={RouterLink} color="success" to={"/users/new"}>Add User</Button>
                    </Box>
                    <h3>Users</h3>

                    <Grid container spacing={3}>
                        {/* Datasets */}
                        <Grid item xs={12}>
                            <Paper >
                                <UserListComponent/>
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
}
export default UserManagement;
