import React, {useEffect, useState} from 'react'
import LinkIcon from '@mui/icons-material/Link';
import StorageIcon from '@mui/icons-material/Storage';
import {Auth} from 'aws-amplify'

import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Link,
    Modal,
    Paper,
    Stack, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tabs,
    Typography
} from "@mui/material";

import {initialDataset} from "./DatasetEdit";
import {Link as RouterLink} from "react-router-dom";
import DatasetForm from "./DatasetForm";
import DatasetClient from "./api/DatasetClient";

const modalMode = Object.freeze({ _EDIT: 'edit', _READ: 'read' })

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

//dataset metadata specification as per
// p.19: https://extranet.itu.int/sites/itu-t/focusgroups/ai4h/docs/FGAI4H-J-049.pdf
// and p. 4: https://extranet.itu.int/sites/itu-t/focusgroups/ai4h/_layouts/15/WopiFrame.aspx?sourcedoc=%7B3DAE32A1-24FF-4F4D-A735-F378056BA6CF%7D&file=FGAI4H-J-048.docx&action=default&CT=1610025396926&OR=DocLibClassicUI

export default function CatalogDatasets(props) {

    const [datasets, setDatasets] = useState(props.datasets)
    const [formState, setFormState] = useState(initialDataset)
    const [open, setOpen] = useState(false);



    const [backdropOpen] = useState(false);

    useEffect(() => {
        setDatasets(props.datasets);
    }, [props.datasets])

    async function fetchTable(catalog_uuid, table_name) {
        const token = await Auth.currentAuthenticatedUser({bypassCache: false})

        const client = new DatasetClient(token.signInUserSession.accessToken.jwtToken);
        const result = await client.fetchTableFromCatalog(catalog_uuid, table_name);
        return result.data

    }

    async function viewDataset(catalog_uuid, table_name) {
        const tableState = await fetchTable(catalog_uuid, table_name);
        handleModalOpen(modalMode._READ, tableState);
    }

    async function link(dataset) {
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(currentUser => {
            const client = new DatasetClient(currentUser.signInUserSession.accessToken.jwtToken);
            client.linkDataset(dataset)
                .then(
                    _response => {

                    });
        }).catch(err => console.log(err));
    }



    //Open "Add / Edit Dataset" modal
    const handleModalOpen = (_mode, state) => {
        setOpen(true);
        setFormState(state)
    };

    //Close "Add / Edit Dataset" modal
    const handleModalClose = () => {
        setOpen(false);
    };


    return (
        <React.Fragment>


            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell width="5%"></TableCell>
                            <TableCell width="30%">Name</TableCell>
                            <TableCell width="20%">Location</TableCell>
                            <TableCell width="20%">Created on (UTC)</TableCell>
                            <TableCell width="10%" align={"right"}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datasets?.map((dataset) => (
                            <TableRow key={dataset.id}>
                                <TableCell><LinkIcon/></TableCell>
                                <TableCell><Link href="#" onClick={() => viewDataset(dataset.data_catalog_id, dataset.name)}>{dataset.name}</Link></TableCell>
                                <TableCell>{dataset.catalog_location}</TableCell>
                                <TableCell>{(new Date(Date.parse(dataset.created_at))).toLocaleString(navigator.language)}</TableCell>
                                <TableCell>
                                    <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                                        <Button size="small" color="info" onClick={() => link(dataset)}>Link</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Modal
                open={open}
                onClose={handleModalClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        View Dataset
                    </Typography>

                    <DatasetForm readOnlyMode={true} formState={formState}/>

                    <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                        <Button variant="contained" onClick={handleModalClose}>Close</Button>

                    </Stack>

                    <Backdrop open={backdropOpen}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Box>
            </Modal>


        </React.Fragment>
    );
}
