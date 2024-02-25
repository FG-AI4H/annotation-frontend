import {Button, Stack, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Link as RouterLink, useParams} from "react-router-dom";
import {initialRequest} from "./DataAccessRequests";
import {Auth} from "aws-amplify";
import DatasetClient from "./api/DatasetClient";

export const DataAccessRequestForm = (props) =>{
    let params = useParams();
    const [formState, setFormState] = useState(props.formState);
    const [readOnlyMode, setReadOnlyMode] = useState(props.readOnlyMode);
    const [owner, setOwner] = useState(props.owner);

    useEffect(() => {
        setFormState(props.formState)
        setOwner(props.owner)
    }, [props.formState]);

    function addRequest(request) {

    }

    function updateRequest(request) {

    }

    async function handleDataset() {
        try {
            if (!formState.name || !formState.description) return

            const request = { ...formState }

            if(params.id === 'new'){
                addRequest(request);
            }
            else {
                updateRequest(request);
            }

        } catch (err) {

            alert('error creating dataset')
            setFormState(initialRequest)
        }
    }

    //Update input field in "Add Dataset" Modal
    function setInput(key, value) {
        setFormState({ ...formState, [key]: value })
    }

    function accept() {
        setFormState({ ...formState, 'request_status': 'APPROVED' })
        updateRequest("APPROVED")
    }

    function reject() {
        setFormState({ ...formState, 'request_status': 'REJECTED' })
        updateRequest("REJECTED")
    }

    function deprecate() {
        setFormState({ ...formState, 'request_status': 'DEPRECATED' })
        updateRequest("DEPRECATED")
    }

    function updateRequest(newStatus){
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(currentUser => {
            const client = new DatasetClient(currentUser.signInUserSession.accessToken.jwtToken);
            client.updateDataAccessRequestStatus(formState.id, newStatus)
                .then(
                    _response => {

                    });
        }).catch(err => console.log(err));
    }



    return (
        <>

            <form noValidate autoComplete="off">
                <TextField fullWidth margin={"normal"}
                           label="Requester"
                           required
                           value={formState.requester_name}
                           onChange={event => setInput('requester_name', event.target.value)}
                           InputLabelProps={{ shrink: true }}
                           disabled={readOnlyMode}
                />

                <TextField fullWidth margin={"normal"}
                           label="Owner"
                           required
                           value={formState.data_owner_name}
                           onChange={event => setInput('data_owner_name', event.target.value)}
                           InputLabelProps={{ shrink: true }}
                           disabled={readOnlyMode}
                />

                <TextField fullWidth margin={"normal"}
                           label="Dataset"
                           required
                           value={formState.dataset_name}
                           onChange={event => setInput('dataset_name', event.target.value)}
                           InputLabelProps={{ shrink: true }}
                           disabled={readOnlyMode}
                />

                <TextField fullWidth margin={"normal"}
                           label="Motivation"
                           multiline
                           required
                           rows={4}
                           value={formState.motivation}
                           onChange={event => setInput('motivation', event.target.value)}
                           InputLabelProps={{ shrink: true }}
                           disabled={readOnlyMode}
                />

            </form>
            {owner &&
                <Stack direction="row" spacing={2} sx={{mt: 5}}>
                    {!readOnlyMode &&
                    <>
                        <Button variant="contained"
                                onClick={handleDataset}>{params.id === 'new' ? 'Add' : 'Update'}</Button>
                        <Button component={RouterLink} color="secondary" to="/datasets">Back</Button>
                    </>
                    }
                    {readOnlyMode &&
                    <>
                        {formState.request_status === 'PENDING' &&
                        <Button variant="contained" color="success" onClick={accept}>Approve</Button>
                        }
                        {formState.request_status === 'PENDING' &&
                        <Button variant="contained" color="error" onClick={reject}>Reject</Button>
                        }
                        {formState.request_status === 'APPROVED' &&
                        <Button variant="contained" color="info" onClick={deprecate}>Deprecate</Button>
                        }
                    </>
                    }
                </Stack>
            }
        </>
    )

}
