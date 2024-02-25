import React, {useEffect, useState} from 'react';
import AppNavbar from './AppNavbar';
import {Link as RouterLink, useNavigate, useParams} from 'react-router-dom';
import {Auth} from "aws-amplify";
import {
    Backdrop,
    Button,
    CircularProgress,
    Container, FormControl,
    FormGroup, InputLabel,
    MenuItem, Select,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";
import Alert from "@mui/material/Alert";
import AdminClient from "./api/AdminClient";

const emptyItem = {
    name: '',
    description: '',
    provider: '',
    provider_catalog_id: '',
    id: undefined,
    aws_region: '',
    database_name: '',
    bucket_name: '',
};

const CatalogEdit = (_props) => {

    let params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState(emptyItem);
    const [updated, setUpdated] = useState(false);
    const [updateType, setUpdateType] = useState("success");

    const navigate = useNavigate();

    useEffect( () => {
        setIsLoading(true);

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            if (params.id !== 'new') {
                const client = new AdminClient(response.signInUserSession.accessToken.jwtToken);

                client.fetchDataCatalogById(params.id)
                    .then(
                        res => {
                            setItem(res.data);
                            setIsLoading(false);
                        });
            }
            setIsLoading(false);
        }).catch(err => console.log(err));
    },[]);


    function handleClose(_event, reason){
        if (reason === 'clickaway') {
            return;
        }
        setUpdated(false)
    }

    function handleChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if(target.type === 'checkbox'){
            value = target.checked;
        }

        let catalog = {...item};
        catalog[name] = value;
        setItem(catalog);
    }

    //Update input field in "Add Dataset" Modal
    function setInput(key, value) {
        setItem({ ...item, [key]: value })
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new AdminClient(response.signInUserSession.accessToken.jwtToken);
            if(item.id) {
                client.updateDataCatalog(item)
                    .then(
                        _response => {
                            setUpdated(true);
                            setUpdateType("success");
                            setIsLoading(false);
                        });
            }
            else{
                client.addDataCatalog(item)
                    .then(
                        res => {
                            setIsLoading(false);
                            if(res?.success){
                                setItem(res?.data)
                                navigate('/dataCatalogs/'+res.data.headers.get('location'));

                            }
                            else{
                                setUpdated(true);
                                setUpdateType("error");
                            }

                        });
            }
        }).catch(err => console.log(err));

    }

    const title = <h2>{item.id ? 'Edit Catalog' : 'Add Catalog'}</h2>;

    return (
        <div>
            <Backdrop open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={updated} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}>
                <Alert severity={updateType} sx={{ width: '100%' }} onClose={handleClose}>
                    Catalog updated successfully!
                </Alert>
            </Snackbar>
            <AppNavbar/>
            <Container className={'pt-5'}>
                {title}

                <TextField fullWidth margin={"normal"}
                           label="Name"
                           name="name"
                           required
                           value={item.name}
                           onChange={event => handleChange(event)}
                           InputLabelProps={{ shrink: true }}

                />

                <TextField fullWidth margin={"normal"}
                           label="Description"
                           name="description"
                           multiline
                           rows={4}
                           value={item.description}
                           onChange={event => handleChange(event)}
                           InputLabelProps={{ shrink: true }}
                />


                <FormControl fullWidth margin={"normal"}>
                    <InputLabel >Provider</InputLabel>
                    <Select
                        id="provider"
                        name="provider"
                        required
                        value={item.provider}
                        label="Provider"
                        onChange={event => setInput('provider', event.target.value)}
                    >
                        <MenuItem value={"AWS"}>AWS</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                    <InputLabel >AWS region</InputLabel>
                    <Select
                        id="aws_region"
                        name="aws_region"
                        required
                        value={item.aws_region}
                        label="AWS region"
                        onChange={event => setInput('aws_region', event.target.value)}
                    >
                        <MenuItem value={"eu-central-1"}>Europe (Frankfurt)</MenuItem>
                        <MenuItem value={"sa-east-1"}>South America (São Paulo)</MenuItem>
                    </Select>
                </FormControl>

                <TextField fullWidth margin={"normal"}
                           label="Provider Catalog ID"
                           name="provider_catalog_id"
                           value={item.provider_catalog_id}
                           onChange={event => handleChange(event)}
                           InputLabelProps={{ shrink: true }}
                />


                <TextField fullWidth margin={"normal"}
                           label="Database name"
                           name="database_name"
                           value={item.database_name}
                           onChange={event => handleChange(event)}
                           InputLabelProps={{ shrink: true }}
                />

                <TextField fullWidth margin={"normal"}
                           label="Bucket name"
                           name="bucket_name"
                           value={item.bucket_name}
                           onChange={event => handleChange(event)}
                           InputLabelProps={{ shrink: true }}
                />



                <FormGroup sx={{ mt: 5 }}>

                    <Stack direction="row" spacing={2}>
                        <Button color="primary" onClick={e => handleSubmit(e)}>Save</Button>
                        <Button component={RouterLink} color="secondary" to={"/dataCatalogs"}>Cancel</Button>
                    </Stack>

                </FormGroup>
            </Container>
        </div>
    )
}
export default CatalogEdit;
