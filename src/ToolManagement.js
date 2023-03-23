import AppNavbar from "./AppNavbar";
import {Box, Button, Container, Grid, IconButton, Paper} from "@mui/material";
import {Replay} from "@mui/icons-material";
import {Link as RouterLink} from "react-router-dom";
import React from "react";
import AnnotationToolListComponent from "./components/AnnotationToolListComponent";

const ToolManagement = (_props) => {

    function refresh() {
        return undefined;
    }

    return(
        <div>
            <AppNavbar/>
            <Container maxWidth="xl" sx={{ mt: 5 }}>
                <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => refresh()}><Replay /></IconButton>{' '}
                    <Button component={RouterLink} color="success" to={"/users/new"}>Add Tool</Button>
                </Box>
                <h3>Annotation Tools</h3>

                <Grid container spacing={3}>
                    {/* Datasets */}
                    <Grid item xs={12}>
                        <Paper >
                            <AnnotationToolListComponent/>
                        </Paper>
                    </Grid>
                </Grid>
                <div className="container">
                    <Button component={RouterLink} color="secondary" to={"/admin"}>Back</Button>
                </div>
            </Container>
        </div>
    )
}
export default ToolManagement;
