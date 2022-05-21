import React, {Component} from "react";
import AppNavbar from "./AppNavbar";
import {Button, Card, CardActions, CardContent, Container, Grid, Typography} from "@mui/material";
import {Link as RouterLink} from 'react-router-dom';

const AdminHome = (props) => {

    return (
        <>
            <AppNavbar/>
            <Container maxWidth="xl" sx={{ mt: 5 }}>
            <Grid container
                  spacing={2}
                  direction="row"
                  justifyContent="space-evenly"
                  alignItems="stretch" sx={{ mt: 5 }}>
                <Grid item xs={12}>
                    <h1 className="header">Platform Administration</h1>
                </Grid>
                <Grid item xs={12}>
                    <h5>Please choose an option</h5>
                </Grid>

                <Grid item xs={12} md={4}>

                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Users & Groups
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage users and groups, assign roles and more.
                            </Typography>

                        </CardContent>
                        <CardActions>

                           <Button component={RouterLink} color="primary" to="/userManagement">User management</Button>
                        </CardActions>
                    </Card>

                </Grid>
            </Grid>
            </Container>
        </>
    );

}
export default AdminHome
