import React, {Component} from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import {Link as RouterLink} from 'react-router-dom';
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";


class AnnotationHome extends Component {
    render() {
        return (
            <div>
                <AppNavbar/>
                <Grid container>
                    <Grid item xs={12}>
                        <h1 className="header">Welcome To The FG-AI4H Annotation Tool</h1>
                    </Grid>
                    <Grid item xs={12}>
                        <h5>Please choose an option</h5>
                    </Grid>
                    <Grid item xs={3}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Campaigns
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage annotation campaigns.
                            </Typography>

                        </CardContent>
                        <CardActions>
                            <Button component={RouterLink} variant="primary" to="/campaigns">Campaigns</Button>
                        </CardActions>
                    </Card>
                        </Grid>
                        <Grid item xs={3}>
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        My Tasks
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        View all my tasks and work on them.
                                    </Typography>

                                </CardContent>
                                <CardActions>
                                    <Button component={RouterLink} variant="primary" to="/myTasks">My Tasks</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    <Grid item xs={3}>

                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Tasks
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    List all tasks and get statistics about them.
                                </Typography>

                            </CardContent>
                            <CardActions>
                                <Button component={RouterLink} variant="primary" to="/tasks">Tasks</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default AnnotationHome;
