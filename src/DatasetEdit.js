import React, {useEffect, useState} from "react";
import {API, Auth} from "aws-amplify";
import CampaignClient from "./api/CampaignClient";
import {Link as RouterLink, useParams} from "react-router-dom";
import AWS from "aws-sdk";
import {getDataset} from "./graphql/queries";
import DatasetItemModal from "./DatasetItemModal.js"
import 'react-medium-image-zoom/dist/styles.css'
import {
    Box,
    Button,
    Container, FormControlLabel, ImageList, ImageListItem, ImageListItemBar,
    Paper,
    Stack, Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import AppNavbar from "./AppNavbar";
import OCISpinner from "./components/OCISpinner";
import DatasetForm from "./DatasetForm";
import {initialItem} from "./DatasetItemModal";

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

    useEffect( () =>{
        setIsLoading(true);

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            if (params.id !== 'new') {
                API.graphql({ query: getDataset, variables: {id: params.id} }).then(datasetData => {
                    setDatatset(datasetData.data.getDataset);
                    fetchBinary(datasetData.data.getDataset.storageLocation.replace('fhir-service-dev-fhirbinarybucket-yjeth32swz5m.s3.eu-central-1.amazonaws.com/',''));
                    setIsLoading(false);
                })
            }
            else {
                setIsLoading(false);
            }

        }).catch(err => console.log(err));

    }, [])

    async function fetchBinary(storageLocation){

        const authSession = await Auth.currentSession()

        if (authSession != null) {
            // Add the User's Id Token to the Cognito credentials login map.
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'eu-central-1:8500a16d-459b-496d-8e87-0e3dea7e3bf6',
                Logins: {
                    'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_1cFVgcU36': authSession.getIdToken().getJwtToken()
                }
            },{ region: 'eu-central-1'});
        }

        let s3 = new AWS.S3({apiVersion: '2006-03-01', params: {Bucket: 'fhir-service-dev-fhirbinarybucket-yjeth32swz5m'}})

        s3.listObjectsV2({Prefix: storageLocation},async function(err, data) {
            if (err) {
                return alert('There was an error listing your albums: ' + err.message);
            } else {

                let bucketUrl = 'https://fhir-service-dev-fhirbinarybucket-yjeth32swz5m.s3.amazonaws.com/'

                let items = data.Contents.filter(item => item.Size > 0);

                items = await Promise.all(items.map(async (photo) => {

                    let photoKey = photo.Key;
                    let photoUrl = bucketUrl + encodeURIComponent(photoKey);

                    const params = {
                        Bucket: 'fhir-service-dev-fhirbinarybucket-yjeth32swz5m',
                        Key: photoKey,
                    }
                    const data = await s3.getObject(params).promise();
                    const base64String = btoa(data.Body.reduce(function (data, byte) {
                        return data + String.fromCharCode(byte);
                    }, ''));
                    return {photoKey: photoKey, photoUrl: photoUrl, photoData: base64String}

                }));

                setItems(items);
            }
        });
    }

    function handleModalOpen(state){
        setCurrentItem(state);
        setOpen(true);
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
            <ImageList cols={3} gap={10}>
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
                            title={item.photoKey}
                            subtitle={<span>by: {item.author}</span>}
                            position="below"
                        />
                    </ImageListItem>

</>

                ))}
            </ImageList>


    const title = <h2>{dataset.id ? 'Edit Dataset' : 'Add Dataset'}</h2>;

    if (isLoading) {
        return (<OCISpinner/>);
    }

    const handleToggleChange = (event) => {
        setIsItemsAsList(event.target.checked);
    };

    return(
        <>
            <AppNavbar/>
            <Container maxWidth="xl" sx={{ mt: 5 }}>
                {title}
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



            </Container>
        </>


    )

}
export default DatasetEdit
