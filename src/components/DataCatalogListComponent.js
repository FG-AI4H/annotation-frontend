import React, {useEffect, useState} from "react";
import {Auth} from "aws-amplify";
import AdminClient from "../api/AdminClient";
import {
    Backdrop,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";

const DataCatalogListComponent = (props) => {

    const [isLoading, setLoading] = useState(false);
    const [dataCatalogList, setDataCatalogList] = useState([]);

    useEffect(() => {
        setLoading(true);
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {

            const adminCLient = new AdminClient(response.signInUserSession.accessToken.jwtToken);
            adminCLient.fetchDataCatalogList()
                .then(
                    response => {
                        if (response?.data) {
                            setDataCatalogList(response?.data);

                        }
                        setLoading(false);
                    });


        }).catch(err => console.log(err));

    }, []);

    const catalogList = dataCatalogList?.map(catalog => {
        return <TableRow key={catalog.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell style={{whiteSpace: 'nowrap'}}>{catalog.name}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{catalog.provider}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{catalog.provider_catalog_id}</TableCell>
            <TableCell>
                <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                    <Button component={RouterLink} size="small" to={"/dataCatalogs/" + catalog.id}>Edit</Button>
                </Stack>

            </TableCell>
        </TableRow>
    });

    return(
        <>
            <Backdrop open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell width={"45%"}>Name</TableCell>
                            <TableCell width={"45%"}>Provider</TableCell>
                            <TableCell width={"45%"}>ID</TableCell>
                            <TableCell width={"10%"} align={"right"}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {catalogList}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    )

}
export default DataCatalogListComponent;
