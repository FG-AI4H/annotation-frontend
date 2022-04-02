import React, {Component} from "react";
import AppNavbar from "./AppNavbar";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import {Link as RouterLink} from 'react-router-dom';

class AdminHome extends Component {
    render() {
        return (
            <>
                <AppNavbar/>
                <Grid container>
                    <Grid item xs={12}>
                        <h1 className="header">Platform Administration</h1>
                    </Grid>
                    <Grid item xs={12}>
                        <h5>Please choose an option</h5>
                    </Grid>

                    <Grid item xs={3}>

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
            </>
        );
    }
}
export default AdminHome
