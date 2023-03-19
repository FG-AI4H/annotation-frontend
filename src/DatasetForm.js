import {Backdrop, Box, Button, CircularProgress, Grid, InputLabel, Stack, TextField} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import {ExpandMore} from "@mui/icons-material";
import AccordionDetails from "@mui/material/AccordionDetails";
import React, {useEffect, useState} from "react";
import {initialDataset} from "./DatasetEdit";
import Auth from "@aws-amplify/auth";
import axios from "axios";
import {Link as RouterLink, useParams} from "react-router-dom";
import DatasetClient from "./api/DatasetClient";
import withNavigateHook from "./helpers/withNavigateHook";

const DatasetForm = (props) =>{

    let params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [readOnlyMode, setReadOnlyMode] = useState(props.readOnlyMode);
    const [formState, setFormState] = useState(props.formState);

    useEffect(() => {
        setFormState(props.formState);
    }, [props.formState]);

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
    async function handleDataset() {
        try {
            if (!formState.name || !formState.description) return

            setIsLoading(true);
            const dataset = { ...formState }


            //const fhirAPIKey = await SecretsManager.getSecret("fhirAPIKey");

            if(params.id === 'new'){
                addDataset(dataset);
            }
            else {
                updateDataset(dataset);
            }


        } catch (err) {
            setIsLoading(false);
            alert('error creating dataset')
            setFormState(initialDataset)
        }
    }

    async function addDataset(dataset){

        const authSession = await Auth.currentSession()

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authSession.getAccessToken().getJwtToken(),
            'X-Api-Key': 'fmIhJxclgb3GKFdoOG0tB4ZvvV2K4GeZab3WgZLr'
        }

        const file = dataset.selectedFile[0]
        setIsLoading(true);

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new DatasetClient(response.signInUserSession.accessToken.jwtToken);

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
                        name: dataset.name,
                        description: dataset.description,
                        storage_location: filepath,
                        metadata: {
                            version: '1.0',
                            data_owner: dataset.metadata?.data_owner,
                            data_source: dataset.metadata?.data_owner,
                            data_sample_size: dataset.metadata?.data_sample_size,
                            data_type: dataset.metadata?.data_type,
                            data_update_version: dataset.metadata?.data_update_version,
                            data_acquisition_sensing_modality: dataset.metadata?.data_acquisition_sensing_modality,
                            data_acquisition_sensing_device_type: dataset.metadata?.data_acquisition_sensing_device_type,
                            data_collection_place: dataset.metadata?.data_collection_place,
                            data_collection_period: dataset.metadata?.data_collection_period,
                            data_collection_authors_agency: dataset.metadata?.data_collection_authors_agency,
                            data_collection_funding_agency: dataset.metadata?.data_collection_funding_agency,
                            data_sampling_rate: dataset.metadata?.data_sampling_rate,
                            data_dimension: dataset.metadata?.data_dimension,
                            data_resolution_precision: dataset.metadata?.data_resolution_precision,
                            data_privacy_de_identification_protocol: dataset.metadata?.data_privacy_de_identification_protocol,
                            data_safety_security_protocol: dataset.metadata?.data_safety_security_protocol,
                            data_assumptions_constraints_dependencies: dataset.metadata?.data_assumptions_constraints_dependencies,
                            data_exclusion_criteria: dataset.metadata?.data_exclusion_criteria,
                            data_acceptance_standards_compliance: dataset.metadata?.data_acceptance_standards_compliance,
                            data_preprocessing_techniques: dataset.metadata?.data_preprocessing_techniques,
                            data_annotation_process_tool: dataset.metadata?.data_annotation_process_tool,
                            data_bias_and_variance_minimization: dataset.metadata?.data_bias_and_variance_minimization,
                            train_tuning_eval_dataset_partitioning_ratio: dataset.metadata?.train_tuning_eval_dataset_partitioning_ratio,
                            data_registry_url: dataset.metadata?.data_registry_url
                        }
                    }

                    client.addDataset(datasetUpload).then(
                        response => {
                            setIsLoading(false);
                            props.navigation('/datasets/'+response.data.headers.get('location'));
                        }, err => {
                            setIsLoading(false);
                            console.log(err)
                        }
                    )
                })
        })
    }

    async function updateDataset(dataset) {
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new DatasetClient(response.signInUserSession.accessToken.jwtToken);

            const datasetUpload = {
                id: dataset.id,
                name: dataset.name,
                description: dataset.description,
                storage_location: dataset.storage_location,
                metadata: {
                    id: dataset.metadata?.id,
                    version: '1.0',
                    data_owner: dataset.metadata?.data_owner,
                    data_sample_size: dataset.metadata?.data_sample_size,
                    data_type: dataset.metadata?.data_type,
                    data_update_version: dataset.metadata?.data_update_version,
                    data_acquisition_sensing_modality: dataset.metadata?.data_acquisition_sensing_modality,
                    data_acquisition_sensing_device_type: dataset.metadata?.data_acquisition_sensing_device_type,
                    data_collection_place: dataset.metadata?.data_collection_place,
                    data_collection_period: dataset.metadata?.data_collection_period,
                    data_collection_authors_agency: dataset.metadata?.data_collection_authors_agency,
                    data_collection_funding_agency: dataset.metadata?.data_collection_funding_agency,
                    data_sampling_rate: dataset.metadata?.data_sampling_rate,
                    data_dimension: dataset.metadata?.data_dimension,
                    data_resolution_precision: dataset.metadata?.data_resolution_precision,
                    data_privacy_de_identification_protocol: dataset.metadata?.data_privacy_de_identification_protocol,
                    data_safety_security_protocol: dataset.metadata?.data_safety_security_protocol,
                    data_assumptions_constraints_dependencies: dataset.metadata?.data_assumptions_constraints_dependencies,
                    data_exclusion_criteria: dataset.metadata?.data_exclusion_criteria,
                    data_acceptance_standards_compliance: dataset.metadata?.data_acceptance_standards_compliance,
                    data_preprocessing_techniques: dataset.metadata?.data_preprocessing_techniques,
                    dataAnnotationProcessTool: dataset.metadata?.dataAnnotationProcessTool,
                    data_bias_and_variance_minimization: dataset.metadata?.data_bias_and_variance_minimization,
                    train_tuning_eval_dataset_partitioning_ratio: dataset.metadata?.train_tuning_eval_dataset_partitioning_ratio,
                    data_registry_url: dataset.metadata?.data_registry_url
                }
            }

            client.updateDataset(datasetUpload).then(
                response => {
                    setIsLoading(false);
                    return response
                }
            )
        })


    }

    //HTML part of "Add Dataset" modal
    return (
<>

    <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
    </Backdrop>

            <form noValidate autoComplete="off">
                <TextField fullWidth margin={"normal"}
                           label="Name"
                           required
                           value={formState.name}
                           onChange={event => setInput('name', event.target.value)}
                           InputLabelProps={{ shrink: true }}
                           disabled={readOnlyMode}
                />

                <TextField fullWidth margin={"normal"}
                           label="Description"
                           multiline
                           required
                           rows={4}
                           value={formState.description}
                           onChange={event => setInput('description', event.target.value)}
                           InputLabelProps={{ shrink: true }}
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
                                    <TextField fullWidth label={"Data Owner"} required id="component-filled2" value={formState.metadata?.data_owner} onChange={event => setInputMetadata('data_owner', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label={"Data Source"} required id="component-filled4" value={formState.metadata?.data_owner} onChange={event => setInputMetadata('data_owner', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label={"Data Registry URL"} id="component-filled27" value={formState.metadata?.data_registry_url} onChange={event => setInputMetadata('data_registry_url', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Sample Size"} required id="component-filled5" value={formState.metadata?.data_sample_size} onChange={event => setInputMetadata('data_sample_size', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Type"} required id="component-filled6" value={formState.metadata?.data_type} onChange={event => setInputMetadata('data_type', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label={"Data Update Version"} id="component-filled7" value={formState.metadata?.data_update_version} onChange={event => setInputMetadata('data_update_version', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Assumptions/ Constraints/Dependencies"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.data_assumptions_constraints_dependencies}
                                               onChange={event => setInputMetadata('data_assumptions_constraints_dependencies', event.target.value)}
                                               disabled={readOnlyMode}
                                               InputLabelProps={{ shrink: true }}
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
                                    <TextField fullWidth label={"Data Acquisition / Sensing Modality"} id="component-filled8" value={formState.metadata?.data_acquisition_sensing_modality} onChange={event => setInputMetadata('data_acquisition_sensing_modality', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Acquisition / Sensing Device Type"} id="component-filled9" value={formState.metadata?.data_acquisition_sensing_device_type} onChange={event => setInputMetadata('data_acquisition_sensing_device_type', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Collection Place"} id="component-filled10" value={formState.metadata?.data_collection_place} onChange={event => setInputMetadata('data_collection_place', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Collection Period"} id="component-filled11" value={formState.metadata?.data_collection_period} onChange={event => setInputMetadata('data_collection_period', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Collection Author"} id="component-filled12" value={formState.metadata?.data_collection_authors_agency} onChange={event => setInputMetadata('data_collection_authors_agency', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label={"Data Collection Funding Agency"} id="component-filled13" value={formState.metadata?.data_collection_funding_agency} onChange={event => setInputMetadata('data_collection_funding_agency', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
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

                                    <TextField fullWidth label={"Data Resolution / Precision"} id="component-filled16" value={formState.metadata?.data_resolution_precision} onChange={event => setInputMetadata('data_resolution_precision', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Privacy or De-identification Protocol"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.data_privacy_de_identification_protocol}
                                               onChange={event => setInputMetadata('data_privacy_de_identification_protocol', event.target.value)}
                                               InputLabelProps={{ shrink: true }}
                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Safety & Security Protocol"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.data_safety_security_protocol}
                                               onChange={event => setInputMetadata('data_safety_security_protocol', event.target.value)}
                                               InputLabelProps={{ shrink: true }}
                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Exclusion Criteria"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.data_exclusion_criteria}
                                               onChange={event => setInputMetadata('data_exclusion_criteria', event.target.value)}
                                               InputLabelProps={{ shrink: true }}
                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Acceptance-Standards Compliance"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.data_acceptance_standards_compliance}
                                               onChange={event => setInputMetadata('data_acceptance_standards_compliance', event.target.value)}
                                               InputLabelProps={{ shrink: true }}
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
                                    <TextField fullWidth label={"Data Sampling Rate"} id="component-filled14" value={formState.metadata?.data_sampling_rate} onChange={event => setInputMetadata('data_sampling_rate', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={6}>

                                    <TextField fullWidth label={"Data Dimension"} id="component-filled15" value={formState.metadata?.data_dimension} onChange={event => setInputMetadata('data_dimension', event.target.value)} disabled={readOnlyMode} InputLabelProps={{ shrink: true }}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Pre-processing Technique(s)"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.dataPreprocessingTechnique}
                                               onChange={event => setInputMetadata('dataPreprocessingTechnique', event.target.value)}
                                               InputLabelProps={{ shrink: true }}
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
                                               InputLabelProps={{ shrink: true }}
                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Data Bias & Variance Minimization"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.data_bias_and_variance_minimization}
                                               onChange={event => setInputMetadata('data_bias_and_variance_minimization', event.target.value)}
                                               InputLabelProps={{ shrink: true }}
                                               disabled={readOnlyMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth
                                               id="filled-multiline-flexible"
                                               label="Train: Tuning(validation) : Test (evaluation) Dataset Partitioning Ratio"
                                               multiline
                                               rows={4}
                                               value={formState.metadata?.train_tuning_eval_dataset_partitioning_ratio}
                                               onChange={event => setInputMetadata('train_tuning_eval_dataset_partitioning_ratio', event.target.value)}
                                               InputLabelProps={{ shrink: true }}
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
                                   value={formState.storage_location}
                                   disabled={readOnlyMode}
                                   InputLabelProps={{ shrink: true }}
                        />

                    </div>
                    :
                    <div>
                        <TextField fullWidth margin={"normal"}
                                   required
                                   label="Storage Location"
                                   id="component-filled2"
                                   value={formState.storage_location}
                                   disabled={readOnlyMode}
                                   InputLabelProps={{ shrink: true }}
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

            <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                {!readOnlyMode &&
                    <>
                <Button variant="contained" onClick={handleDataset}>{params.id === 'new' ? 'Add' : 'Update'}</Button>
                    <Button component={RouterLink} color="secondary" to="/datasets">Back</Button>
                    </>
                }
            </Stack>
</>

    );

}
export default withNavigateHook(DatasetForm)
