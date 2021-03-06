import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
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
import React, {useEffect, useState} from "react";
import {Link as RouterLink} from "react-router-dom";
import {style} from "../Datasets";
import {Auth} from "aws-amplify";
import {Check} from "@mui/icons-material";
import DatasetClient from "../api/DatasetClient";

const CampaignDataset = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState(props.datasets)

    useEffect( () => {
        setSelectedDatasets(props.datasets)
    },[props.datasets]);



    //Open "Add / Edit Dataset" modal
    const handleModalOpen = async () => {

        const token = await Auth.currentAuthenticatedUser({bypassCache: false})

        const client = new DatasetClient(token.signInUserSession.accessToken.jwtToken);
        const result = await client.fetchDatasetList();
        setDatasets(result?.data._embedded.dataset)
        setOpen(true)
    };

    //Close "Add / Edit Dataset" modal
    const handleModalClose = () => {
        setOpen(false);
    };

    const handleAddDataset = (dataset) => {
        let updatedList = [...selectedDatasets];
        updatedList.push(dataset);
        setSelectedDatasets(updatedList);
    }

    const removeSelectDataset = (dataset) => {
        let updatedDatasets = [...selectedDatasets].filter(i => i.datasetUUID !== dataset.datasetUUID);
        setSelectedDatasets(updatedDatasets);
    }

    const datatsetList = selectedDatasets.map(dataset => {
        return <TableRow key={dataset.datasetUUID} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell style={{whiteSpace: 'nowrap'}}>{dataset.name}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{dataset.description}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{dataset.size}</TableCell>
            <TableCell>
                <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                    <Button component={RouterLink} size="small" color="primary" to={"/datasets/" + dataset.datasetUUID}>View</Button>
                    <Button size="small" color="error" onClick={() => removeSelectDataset(dataset)}>Remove</Button>
                </Stack>

            </TableCell>
        </TableRow>
    });

    return (
        <>
            <Backdrop open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                <Button onClick={handleModalOpen} color="success">Add Dataset</Button>
            </Box>

            <h3>Selected datasets</h3>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell width={"30%"}>Name</TableCell>
                            <TableCell width={"40%"}>Description</TableCell>
                            <TableCell width={"20%"}>Size</TableCell>
                            <TableCell width={"10%"} align={"right"}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datatsetList}
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
                        Available Datasets
                    </Typography>

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
                                        <TableCell>{dataset.name}</TableCell>
                                        <TableCell>{dataset.description}</TableCell>
                                        <TableCell>{(new Date(Date.parse(dataset.updatedAt))).toLocaleString(navigator.language)}</TableCell>
                                        <TableCell>
                                            <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                                                {selectedDatasets.filter(i => i.datasetUUID === dataset.datasetUUID).length === 0 ?
                                                    <Button size="small" color="primary" onClick={() => handleAddDataset(dataset)}>Add</Button>
                                                    :
                                                    <Check />
                                                }
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                        <Button variant="contained" onClick={handleModalClose}>Close</Button>

                    </Stack>


                </Box>
            </Modal>
        </>
    )
}
export default CampaignDataset
