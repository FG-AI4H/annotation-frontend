import React from "react";
import AppNavbar from "../../components/AppNavbar";
import {Button, Card, CardActions, CardContent, Container, Grid, Typography} from "@mui/material";
import {Link as RouterLink} from 'react-router-dom';

const AdminHome = (props) => {

    return (
        <>
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
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Annotation Tasks
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage annotation tasks.
                            </Typography>

                        </CardContent>
                        <CardActions>

                            <Button component={RouterLink} color="primary" to="/annotationTasks">Task management</Button>
                        </CardActions>
                    </Card>

                </Grid>
                    <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Annotation Tools
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage annotation tools.
                            </Typography>

                        </CardContent>
                        <CardActions>

                            <Button component={RouterLink} color="primary" to="/annotationTools">Tool management</Button>
                        </CardActions>
                    </Card>

                </Grid>


                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Data Catalogs
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage connection to data catalogs.
                            </Typography>

                        </CardContent>
                        <CardActions>

                            <Button component={RouterLink} color="primary" to="/dataCatalogs">Catalog management</Button>
                        </CardActions>
                    </Card>

                </Grid>

            </Grid>
            </Container>
        </>
    );

}
export default AdminHome
