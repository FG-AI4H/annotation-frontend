import {Backdrop, Box, Button, CircularProgress, Grid, InputLabel, Stack, TextField, Typography} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import {ExpandMore} from "@mui/icons-material";
import AccordionDetails from "@mui/material/AccordionDetails";
import React, {useEffect, useState} from "react";
import {initialDataset} from "./DatasetEdit";
import Auth from "@aws-amplify/auth";
import axios from "axios";
import uuid from "react-uuid";
import {API, graphqlOperation} from "aws-amplify";
import {createDataset} from "./graphql/mutations";

const DatasetForm = (props) =>{

    const [readOnlyMode, setReadOnlyMode] = useState(true);
    const [formState, setFormState] = useState(initialDataset);

    //Load at page load
    useEffect(() => {
        setFormState(props.formState);
        setReadOnlyMode(props.readOnlyMode);
    }, [props])


    //Update input field in "Add Dataset" Modal
    function setInput(key, value) {
        setFormState({ ...formState, [key]: value })
    }

    function setInputMetadata(key, value) {
        setFormState({ ...formState, metadata: { ...formState.metadata, [key]: value, } })
    }

    //Select file to upload for a dataset
    const selectFile = (event) => {
        setInput('selectedFile', event.target.files)
    }

    //Add a new dataset in backend
    //TODO: check that required fields are filled
    async function addDataset() {
        try {
            if (!formState.name || !formState.description) return
            const dataset = { ...formState }
            const authSession = await Auth.currentSession()

            //const fhirAPIKey = await SecretsManager.getSecret("fhirAPIKey");

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authSession.getAccessToken().getJwtToken(),
                'X-Api-Key': 'fmIhJxclgb3GKFdoOG0tB4ZvvV2K4GeZab3WgZLr'
            }

            const file = dataset.selectedFile[0]

            setBackdropOpen(true)

            //push zip file to S3 using FHIR Binary API endpoint
            axios.post('https://vno8vyh8x5.execute-api.eu-central-1.amazonaws.com/dev/Binary', {
                'resourceType': 'Binary',
                'contentType': 'application/zip',
                'securityContext': {
                    'reference': 'DocumentReference/benchmarking-data'
                }
            }, {
                headers: headers
            })
                .then(res => {
                    //use presigned S3 URL from FHIR Binary API endpoint to push data to actual S3 bucket
                    return axios.put(res.data.presignedPutUrl, file, {
                        headers: {
                            'Content-Type': file.type
                        }
                    })
                })
                .then(res => {
                    const url = new URL(res.config.url)
                    const filepath = url.hostname + '/' + file.name.replace('.zip', '/')

                    const datasetUpload = {
                        id: uuid(),
                        name: dataset.name,
                        description: dataset.description,
                        storageLocation: filepath,
                        metadata: {
                            version: '1.0',
                            dataOwner: dataset.metadata?.dataOwner,
                            dataSource: dataset.metadata?.dataSource,
                            dataSampleSize: dataset.metadata?.dataSampleSize,
                            dataType: dataset.metadata?.dataType,
                            dataUpdateVersion: dataset.metadata?.dataUpdateVersion,
                            dataAcquisitionSensingModality: dataset.metadata?.dataAcquisitionSensingModality,
                            dataAcquisitionSensingDeviceType: dataset.metadata?.dataAcquisitionSensingDeviceType,
                            dataCollectionPlace: dataset.metadata?.dataCollectionPlace,
                            dataCollectionPeriod: dataset.metadata?.dataCollectionPeriod,
                            datCollectionAuthorsAgency: dataset.metadata?.datCollectionAuthorsAgency,
                            dataCollectionFundingAgency: dataset.metadata?.dataCollectionFundingAgency,
                            dataSamplingRate: dataset.metadata?.dataSamplingRate,
                            dataDimension: dataset.metadata?.dataDimension,
                            dataResolutionPrecision: dataset.metadata?.dataResolutionPrecision,
                            dataPrivacyDeIdentificationProtocol: dataset.metadata?.dataPrivacyDeIdentificationProtocol,
                            dataSafetySecurityProtocol: dataset.metadata?.dataSafetySecurityProtocol,
                            dataAssumptionsConstraintsDependencies: dataset.metadata?.dataAssumptionsConstraintsDependencies,
                            dataExclusionCriteria: dataset.metadata?.dataExclusionCriteria,
                            dataAcceptanceStandardsCompliance: dataset.metadata?.dataAcceptanceStandardsCompliance,
                            dataPreprocessingTechniques: dataset.metadata?.dataPreprocessingTechniques,
                            dataAnnotationProcessTool: dataset.metadata?.dataAnnotationProcessTool,
                            dataBiasAndVarianceMinimization: dataset.metadata?.dataBiasAndVarianceMinimization,
                            trainTuningEvalDatasetPartitioningRatio: dataset.metadata?.trainTuningEvalDatasetPartitioningRatio,
                            dataRegistryURL: dataset.metadata?.dataRegistryURL
                        }
                    }

                    return API.graphql(graphqlOperation(createDataset, { input: datasetUpload }))
                }).then(res => {

                alert('Dataset uploaded to S3 and data is saved')
                fetchDatasets()
                setFormState(initialDataset)
            },err => {
                console.log(err)
            })

        } catch (err) {
            alert('error creating dataset')
            setFormState(initialDataset)
        }
    }


    //HTML part of "Add Dataset" modal
    return (

            <form noValidate autoComplete="off">
                <TextField fullWidth margin={"normal"}
                           label="Name"
                           required
                           value={formState.name}
                           onChange={event => setInput('name', event.target.value)}

                           disabled={readOnlyMode}
                />

                <TextField fullWidth margin={"normal"}
                           label="Description"
                           multiline
                           required
                           rows={4}
                           value={formState.description}
                           onChange={event => setInput('description', event.target.value)}

                           disabled={readOnlyMode}
                />

                <Accordion sx={{ mt: 5 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <InputLabel >General Metadata</InputLabel>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ width: '100%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField fullWidth label={"Data Owner"} required id="component-filled2" value={formState.metadata?.dataOwner} onChange={event => setInputMetadata('dataOwner', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label={"Data Source"} required id="component-filled4" value={formState.metadata?.dataSource} onChange={event => setInputMetadata('dataSource', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label={"Data Registry URL"} id="component-filled27" value={formState.metadata?.dataRegistryURL} onChange={event => setInputMetadata('dataRegistryURL', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Sample Size"} required id="component-filled5" value={formState.metadata?.dataSampleSize} onChange={event => setInputMetadata('dataSampleSize', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Type"} required id="component-filled6" value={formState.metadata?.dataType} onChange={event => setInputMetadata('dataType', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label={"Data Update Version"} id="component-filled7" value={formState.metadata?.dataUpdateVersion} onChange={event => setInputMetadata('dataUpdateVersion', event.target.value)} disabled={readOnlyMode} />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Assumptions/ Constraints/Dependencies"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.dataAssumptionsConstraintsDependencies}
                                               onChange={event => setInputMetadata('dataAssumptionsConstraintsDependencies', event.target.value)}
                                               disabled={readOnlyMode}
                                    /><br />
                                </Grid>
                            </Grid>

                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <InputLabel >Data Collection</InputLabel>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ width: '100%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Acquisition / Sensing Modality"} id="component-filled8" value={formState.metadata?.dataAcquisitionSensingModality} onChange={event => setInputMetadata('dataAcquisitionSensingModality', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Acquisition / Sensing Device Type"} id="component-filled9" value={formState.metadata?.dataAcquisitionSensingDeviceType} onChange={event => setInputMetadata('dataAcquisitionSensingDeviceType', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Collection Place"} id="component-filled10" value={formState.metadata?.dataCollectionPlace} onChange={event => setInputMetadata('dataCollectionPlace', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Collection Period"} id="component-filled11" value={formState.metadata?.dataCollectionPeriod} onChange={event => setInputMetadata('dataCollectionPeriod', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Collection Author"} id="component-filled12" value={formState.metadata?.datCollectionAuthorsAgency} onChange={event => setInputMetadata('datCollectionAuthorsAgency', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Collection Funding Agency"} id="component-filled13" value={formState.metadata?.dataCollectionFundingAgency} onChange={event => setInputMetadata('dataCollectionFundingAgency', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <InputLabel >Data Privacy</InputLabel>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ width: '100%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>

                                    <TextField fullWidth label={"Data Resolution / Precision"} id="component-filled16" value={formState.metadata?.dataResolutionPrecision} onChange={event => setInputMetadata('dataResolutionPrecision', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Privacy or De-identification Protocol"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.dataPrivacyDeIdentificationProtocol}
                                               onChange={event => setInputMetadata('dataPrivacyDeIdentificationProtocol', event.target.value)}

                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Safety & Security Protocol"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.dataSafetySecurityProtocol}
                                               onChange={event => setInputMetadata('dataSafetySecurityProtocol', event.target.value)}

                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Exclusion Criteria"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.dataExclusionCriteria}
                                               onChange={event => setInputMetadata('dataExclusionCriteria', event.target.value)}

                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Acceptance-Standards Compliance"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.dataAcceptanceStandardsCompliance}
                                               onChange={event => setInputMetadata('dataAcceptanceStandardsCompliance', event.target.value)}

                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <InputLabel >Data Preparation</InputLabel>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ width: '100%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Sampling Rate"} id="component-filled14" value={formState.metadata?.dataSamplingRate} onChange={event => setInputMetadata('dataSamplingRate', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={6}>

                                    <TextField fullWidth label={"Data Dimension"} id="component-filled15" value={formState.metadata?.dataDimension} onChange={event => setInputMetadata('dataDimension', event.target.value)} disabled={readOnlyMode} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Pre-processing Technique(s)"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.dataPreprocessingTechnique}
                                               onChange={event => setInputMetadata('dataPreprocessingTechnique', event.target.value)}

                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Annotation Process / Tool"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.dataAnnotationProcessTool}
                                               onChange={event => setInputMetadata('dataAnnotationProcessTool', event.target.value)}

                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Bias & Variance Minimization"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.dataBiasAndVarianceMinimization}
                                               onChange={event => setInputMetadata('dataBiasAndVarianceMinimization', event.target.value)}

                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Train: Tuning(validation) : Test (evaluation) Dataset Partitioning Ratio"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.trainTuningEvalDatasetPartitioningRatio}
                                               onChange={event => setInputMetadata('trainTuningEvalDatasetPartitioningRatio', event.target.value)}

                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <br/>

                {readOnlyMode ?
                    <div>

                        <TextField fullWidth margin={"normal"}
                                   required
                                   label="Storage Location"
                                   id="component-filled2"
                                   value={formState.storageLocation}
                                   disabled={readOnlyMode}
                        />

                    </div>
                    :
                    <div>
                        <TextField fullWidth margin={"normal"}
                                   required
                                   label="Storage Location"
                                   id="component-filled2"
                                   value={formState.storageLocation}
                                   disabled={readOnlyMode}
                        />
                        <input
                            id="btn-upload"
                            name="btn-upload"
                            style={{ display: 'none' }}
                            type="file"
                            accept="application/zip"
                            onChange={selectFile} />
                        <label htmlFor="btn-upload">
                            <Button
                                className="btn-choose"
                                variant="outlined"
                                component="span"
                                disabled={readOnlyMode}
                            >
                                Choose Dataset File (.zip)
                            </Button>
                        </label>
                        <div className="file-name">
                            <Box color="text.disabled">{formState.selectedFile !== undefined ? formState.selectedFile[0].name : ''}</Box>
                        </div>
                    </div>
                }

            </form>


    );

}
export default DatasetForm
