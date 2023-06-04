import AppNavbar from "./AppNavbar";
import {Box, Button, Container, Grid, IconButton, Paper} from "@mui/material";
import {Replay} from "@mui/icons-material";
import {Link as RouterLink} from "react-router-dom";
import React from "react";
import AnnotationToolListComponent from "./components/AnnotationToolListComponent";
import DataCatalogListComponent from "./components/DataCatalogListComponent";

const CatalogManagement = (_props) => {

    function refresh() {
        return undefined;
    }

    return(
        <div>
            <AppNavbar/>
            <Container maxWidth="xl" sx={{ mt: 5 }}>
                <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => refresh()}><Replay /></IconButton>{' '}
                    <Button component={RouterLink} color="success" to={"/dataCatalogs/new"}>Add Catalog</Button>
                </Box>
                <h3>Data Catalogs</h3>

                <Grid container spacing={3}>
                    {/* Datasets */}
                    <Grid item xs={12}>
                        <Paper >
                            <DataCatalogListComponent/>
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
export default CatalogManagement;
