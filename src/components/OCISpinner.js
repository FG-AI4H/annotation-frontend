import {CircularProgress, Grid} from "@mui/material";
import React from "react";

const OCISpinner = () => {
    return (<Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
    >

        <Grid item xs={12}>
            <CircularProgress />
        </Grid>
    </Grid> );

}

export default OCISpinner;
