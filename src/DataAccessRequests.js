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
    Paper, Snackbar,
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
import Alert from "@mui/material/Alert";
import {DataAccessRequestForm} from "./DataAccessRequestForm";

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

export const initialRequest = {
    id: undefined,
    request_date:undefined,
    request_status:undefined,
    request_status_date:undefined,
    motivation:undefined,
    requester_id:undefined,
    requester_name:undefined,
    data_owner_id:undefined,
    data_owner_name:undefined,
    dataset_name:undefined,
    dataset_id:undefined
}

//dataset metadata specification as per
// p.19: https://extranet.itu.int/sites/itu-t/focusgroups/ai4h/docs/FGAI4H-J-049.pdf
// and p. 4: https://extranet.itu.int/sites/itu-t/focusgroups/ai4h/_layouts/15/WopiFrame.aspx?sourcedoc=%7B3DAE32A1-24FF-4F4D-A735-F378056BA6CF%7D&file=FGAI4H-J-048.docx&action=default&CT=1610025396926&OR=DocLibClassicUI

export default function DataAccessRequests(props) {

    const [dataAccessRequests, setDataAccessRequests] = useState(props.dataAccessRequests)
    const [request, setRequest] = useState(initialRequest)
    const [open, setOpen] = useState(false);
    const [owner, setOwner] = useState(props.owner);

    useEffect(() => {
        setDataAccessRequests(props.dataAccessRequests)
        setOwner(props.owner)
    }, [props.isLoading])


    function viewRequest(request) {
        handleModalOpen(modalMode._READ, request);
    }

    //Open "Add / Edit Request" modal
    const handleModalOpen = (_mode, state) => {
        setOpen(true);
        setRequest(state)
    };

    //Close "Add / Edit Dataset" modal
    const handleModalClose = () => {
        setOpen(false);
    };

    async function remove(id) {
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(currentUser => {
            const client = new DatasetClient(currentUser.signInUserSession.accessToken.jwtToken);
            client.removeDataAccessRequest(id)
                .then(
                    _response => {
                        let updatedDataAccessRequests = [...dataAccessRequests].filter(i => i.id !== id);
                        setDataAccessRequests(updatedDataAccessRequests);
                    });
        }).catch(err => console.log(err));
    }

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell width="30%">Dataset</TableCell>
                            <TableCell width="20%">Created (UTC)</TableCell>
                            <TableCell width="20%">{owner ? 'Requester' : 'Owner'}</TableCell>
                            <TableCell width="10%">Status</TableCell>
                            <TableCell width="10%" align={"right"}>Actions</TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataAccessRequests?.map((request, index) => (
                            <TableRow key={request.id}>
                                <TableCell><Link href="#" onClick={() => viewRequest(request)}>{request.dataset_name}</Link></TableCell>
                                <TableCell>{(new Date(Date.parse(request.request_date))).toLocaleString(navigator.language)}</TableCell>
                                <TableCell>{owner ? request.requester_name : request.data_owner_name}</TableCell>
                                <TableCell>{request.request_status}</TableCell>
                                <TableCell>
                                    <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                                        <Button size="small" color="error" onClick={() => remove(request.id)}>Delete</Button>
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
                        Data Access Request
                    </Typography>

                    <DataAccessRequestForm readOnlyMode={true} formState={request} owner={owner}/>

                    <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                        <Button variant="contained" onClick={handleModalClose}>Close</Button>

                    </Stack>
                </Box>
            </Modal>


        </React.Fragment>
    );
}
