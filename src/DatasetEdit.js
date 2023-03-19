import React, {useEffect, useState} from "react";
import {Auth} from "aws-amplify";
import {useParams} from "react-router-dom";
import AWS from "aws-sdk";
import DatasetItemModal from "./DatasetItemModal.js"
import 'react-medium-image-zoom/dist/styles.css'
import {
    Backdrop, Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    InputLabel,
    OutlinedInput,
    Paper,
    Stack,
    Switch, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tabs, TextField
} from "@mui/material";
import AppNavbar from "./AppNavbar";
import DatasetForm from "./DatasetForm";
import {initialItem} from "./DatasetItemModal";
import axios from "axios";
import DatasetClient from "./api/DatasetClient";
import {a11yProps} from "./components/allyProps";
import {TabPanel} from "./components/TabPanel";
import Datasets from "./Datasets";
import DatasetPermission from "./DatasetPermission";

export const initialDataset = {
    name: '',
    description: '',
    selectedFile: undefined,
    metadata: {
        //General Metadata
        dataOwner: '',
        dataSource: '',
        dataSampleSize: '',
        dataType: '',
        dataRegistryURL: '',
        dataUpdateVersion: '',
        dataAssumptionsConstraintsDependencies: '',
        //Data Collection
        dataAcquisitionSensingModality: '',
        dataAcquisitionSensingDeviceType: '',
        dataCollectionPlace: '',
        dataCollectionPeriod: '',
        datCollectionAuthorsAgency: '',
        dataCollectionFundingAgency: '',
        //Data Privacy
        dataResolutionPrecision: '',
        dataPrivacyDeIdentificationProtocol: '',
        dataSafetySecurityProtocol: '',
        dataExclusionCriteria: '',
        dataAcceptanceStandardsCompliance: '',
        //Data Preparation
        dataSamplingRate: '',
        dataDimension: '',
        dataPreprocessingTechniques: '',
        dataAnnotationProcessTool: '',
        dataBiasAndVarianceMinimization: '',
        trainTuningEvalDatasetPartitioningRatio: ''
    }
}

const DatasetEdit = () => {
    let params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isItemsAsList, setIsItemsAsList] = useState(false);
    const [dataset, setDatatset] = useState(initialDataset);
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState(initialItem);
    const [open, setOpen] = useState(false);
    const [isMoreItems, setIsMoreItems] = useState(false);
    const [nextContinuationToken, setNextContinuationToken] = useState(null);
    const [itemSize, setItemSize] = useState(489);
    const [fetchSize, setFetchSize] = useState(21);
    const [tabValue, setTabValue] = useState(0);


    useEffect( () =>{
        setIsLoading(true);

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            if (params.id !== 'new') {

                const fetchData = async (prefix) => {
                    await fetchBinary(prefix);
                    setIsLoading(false);
                }

                const client = new DatasetClient(response.signInUserSession.accessToken.jwtToken);
                client.fetchDatasetById(params.id).then(datasetData => {
                    setDatatset(datasetData.data);
                    const prefix = datasetData.data.storage_location.replace('fhir-service-dev-fhirbinarybucket-yjeth32swz5m.s3.eu-central-1.amazonaws.com/','');

                    fetchData(prefix)
                        // make sure to catch any error
                        .catch(console.error);
                })
            }
            else {
                setIsLoading(false);
            }

        }).catch(err => console.log(err));

    }, [itemSize])

    async function fetchBinary(prefix){

        setIsLoading(true)
        const authSession = await Auth.currentSession()

        if (authSession != null) {
            // Add the User's Id Token to the Cognito credentials login map.
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'eu-central-1:8500a16d-459b-496d-8e87-0e3dea7e3bf6',
                Logins: {
                    'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_1cFVgcU36': authSession.getIdToken().getJwtToken()
                }
            }, {region: 'eu-central-1'});


            let s3 = new AWS.S3({
                apiVersion: '2006-03-01',
                region: 'eu-central-1',
                params: {Bucket: 'fhir-service-dev-fhirbinarybucket-yjeth32swz5m'}
            })

            const listedObjects = await s3.listObjectsV2({Prefix: prefix, MaxKeys: fetchSize, ContinuationToken: nextContinuationToken || undefined}).promise();
            if (listedObjects.Contents.length === 0) return;

            if (!listedObjects.IsTruncated) {
                setIsMoreItems(false);
                setNextContinuationToken(null);
            } else {
                setIsMoreItems(true);
                setNextContinuationToken(listedObjects.NextContinuationToken);
            }

            let items = listedObjects.Contents.filter(item => item.Size > 0);

            items = await Promise.all(items.map(async (photo) => {

                let photoKey = photo.Key;
                let photoUrl = encodeURIComponent(photoKey);

                const headers = {
                    'Authorization': 'Bearer ' + authSession.getAccessToken().getJwtToken(),
                    'Accept': '*/*'
                }

                let res = await axios.get(`https://d2u8cqzosvqv1o.cloudfront.net/dev/image-resize?imagePath=${photoKey}&width=${itemSize}`,{
                    headers: headers}).catch(err => {
                    console.error(err);
                    return {data: undefined}
                    });

                let resizedData = res.data;
                return {photoKey: photoKey, photoUrl: photoUrl, photoData: resizedData}

            }));

            setItems(items);
            setIsLoading(false)

        }
    }

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    async function handleModalOpen(state){

        const authSession = await Auth.currentSession()

        if (authSession != null) {
            setIsLoading(true)
            // Add the User's Id Token to the Cognito credentials login map.
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'eu-central-1:8500a16d-459b-496d-8e87-0e3dea7e3bf6',
                Logins: {
                    'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_1cFVgcU36': authSession.getIdToken().getJwtToken()
                }
            }, {region: 'eu-central-1'});

            let s3 = new AWS.S3({
                apiVersion: '2006-03-01',
                region: 'eu-central-1',
                params: {Bucket: 'fhir-service-dev-fhirbinarybucket-yjeth32swz5m'}
            })


            params = {
                Bucket: 'fhir-service-dev-fhirbinarybucket-yjeth32swz5m',
                Key: state.photoKey,
            }

            const data = await s3.getObject(params).promise();
            const base64String = btoa(data.Body.reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
            }, ''));

            let detailItem = {...state}
            detailItem.photoData = base64String;
            setCurrentItem(detailItem);
            setIsLoading(false)
            setOpen(true);
        }
    }

    const handleModalClose = () => {
        setOpen(false);
    }


    const itemList = items.map(item => {
        return <TableRow key={item.photoKey} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell style={{whiteSpace: 'nowrap'}}>{item.photoKey}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>
                <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                    <Button onClick={() => handleModalOpen(item)}>View</Button>
                </Stack>
            </TableCell>

        </TableRow>

    });

    const photos =
        <ImageList cols={3} gap={10} sx={{width: 1}}>
            {items.map((item) => (
                <>
                    <ImageListItem key={item.photoKey} sx={{cursor:"pointer"}}>

                        <img
                            src={`data:image/png;base64,${item.photoData}`}
                            srcSet={`data:image/png;base64,${item.photoData}`}
                            alt={item.title}
                            loading="lazy"
                            onClick={() => handleModalOpen(item)}
                        />

                        <ImageListItemBar
                            sx={{overflowWrap: "break-word", maxWidth: 480}}
                            title={item.photoKey}
                            subtitle={<span>by: {item.author}</span>}
                            position="below"
                        />
                    </ImageListItem>

                </>

            ))}
        </ImageList>


    const title = <h2>{dataset.id ? 'Edit Dataset' : 'Add Dataset'}</h2>;

    const handleToggleChange = (event) => {
        setIsItemsAsList(event.target.checked);
    };

    const handleItemSizeChange = (event) => {
        setItemSize(event.target.value);

    }

    const handleFetchSizeChange = (event) => {
        setFetchSize(event.target.value);

    }

    return(
        <>
            <AppNavbar/>
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="xl" sx={{ mt: 5 }}>
                {title}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleChange}
                            aria-label="wrapped label tabs example"
                        >
                            <Tab label="Dataset" {...a11yProps(0)}/>
                            <Tab label="Permissions" {...a11yProps(1)}/>

                        </Tabs>
                    </Box>
                    <TabPanel value={tabValue} index={0}>

                <DatasetForm readOnlyMode={false} formState={dataset}/>
                {params.id !== 'new' &&
                    <>
                    <Stack direction="row" spacing={2}>

                        <h3>Items</h3>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isItemsAsList}
                                    onChange={handleToggleChange}
                                />
                            }
                            label="Show preview"
                        />
                        {nextContinuationToken &&
                        <>
                            <FormControl>
                                <InputLabel htmlFor="component-size">Fetch size</InputLabel>
                                <OutlinedInput
                                    type={'number'}
                                    id="component-size"
                                    value={fetchSize}
                                    onChange={handleFetchSizeChange}
                                    label="Fetch size"
                                />
                            </FormControl>
                            <Button
                                onClick={() => fetchBinary(dataset?.storage_location?.replace('fhir-service-dev-fhirbinarybucket-yjeth32swz5m.s3.eu-central-1.amazonaws.com/', ''))}>Next</Button>
                        </>

                        }

                        {/*<FormControl>
                            <InputLabel htmlFor="component-size">Item size</InputLabel>
                            <OutlinedInput
                                type={'number'}
                                id="component-size"
                                value={itemSize}
                                onChange={handleItemSizeChange}
                                label="Item size"
                            />
                        </FormControl>*/}


                    </Stack>

                {!isItemsAsList ?
                    <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                    <TableCell width={"80%"}>Key</TableCell>
                    <TableCell width={"20%"} align={"right"}>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                {itemList}
                    </TableBody>
                    </Table>
                    </TableContainer>
                    :
                    <>
                {photos}
                    </>
                }
                    <DatasetItemModal item={currentItem} open={open} handleClose={handleModalClose}/>
                    </>

                }
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <DatasetPermission dataset={dataset}/>
                    </TabPanel>
                </Box>


            </Container>
        </>


    )

}
export default DatasetEdit
