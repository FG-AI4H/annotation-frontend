import React, {useEffect, useState} from 'react'
import {Auth} from 'aws-amplify'

import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Link,
    Modal,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

export default function Datasets(props) {

    const [datasets, setDatasets] = useState([])
    const [formState, setFormState] = useState(initialDataset)
    const [open, setOpen] = useState(false);

    const [backdropOpen, setBackdropOpen] = useState(false);


    //Load at page load
    useEffect(() => {
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new DatasetClient(response.signInUserSession.accessToken.jwtToken);
            client.fetchDatasetList()
                .then(
                    response => {
                        setDatasets(response?.data._embedded.dataset)
                    })

        }).catch(err => console.log(err));
    }, [])


    async function fetchDataset(uuid) {
        const token = await Auth.currentAuthenticatedUser({bypassCache: false})

        const client = new DatasetClient(token.signInUserSession.accessToken.jwtToken);
        const result = await client.fetchDatasetById(uuid);
        return result.data
        
    }

    async function viewDataset(datasetID) {
        const datasetState = await fetchDataset(datasetID);
        handleModalOpen(modalMode._READ, datasetState);
    }

    //Open "Add / Edit Dataset" modal
    const handleModalOpen = (mode, state) => {
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
                            <TableCell width="30%">Name</TableCell>
                            <TableCell width="30%">Description</TableCell>
                            <TableCell width="30%">Last Updated</TableCell>
                            <TableCell width="10%" align={"right"}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datasets.map((dataset) => (
                            <TableRow key={dataset.datasetUUID}>
                                <TableCell><Link href="#" onClick={() => viewDataset(dataset.datasetUUID)}>{dataset.name}</Link></TableCell>
                                <TableCell>{dataset.description}</TableCell>
                                <TableCell>{(new Date(Date.parse(dataset.updatedAt))).toLocaleString(navigator.language)}</TableCell>
                                <TableCell>
                                    <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                                        <Button component={RouterLink} size="small" color="primary" to={"/datasets/" + dataset.datasetUUID}>Edit</Button>
                                        <Button size="small" color="error" onClick={() => this.remove(dataset.datasetUUID)}>Delete</Button>
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
