import React from "react";
import AppNavbar from "./AppNavbar";

import {Container, Grid, Paper} from "@mui/material";
import AnnotationToolListComponent from "./components/AnnotationToolListComponent";


const AnnotationToolList = () => {


    return (
        <div>
            <AppNavbar/>
            <Container maxWidth="lg" >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper>
                            <AnnotationToolListComponent title="Annotation Tools"/>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );

}
export default AnnotationToolList;
