import React, {useEffect, useState} from 'react';
import AppNavbar from './AppNavbar';
import {Link as RouterLink, useNavigate, useParams} from 'react-router-dom';
import AnnotationTaskList from "./AnnotationTaskList";
import SampleList from "./SampleList";
import AnnotationList from "./AnnotationList";
import {Auth} from "aws-amplify";
import TaskClient from "./api/TaskClient";
import {
    Autocomplete,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

const emptyItem = {
    name: '',
    email: '',
    id: undefined,
    read_only: true,
    annotationTasks: [],
    annotations: []
};

const TaskEdit = (_props) => {

    let params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState(emptyItem);
    const [updated, setUpdated] = useState(false);

    const navigate = useNavigate();

    useEffect( () => {
        setIsLoading(true);

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            if (params.id !== 'new') {
                const client = new TaskClient(response.signInUserSession.accessToken.jwtToken);

                client.fetchTaskById(params.id)
                    .then(
                        response => {
                            setItem(response.data);
                            setIsLoading(false);
                        });
            }
        }).catch(err => console.log(err));
    },[]);


    function handleClose(event, reason){
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

        item[name] = value;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new TaskClient(response.signInUserSession.accessToken.jwtToken);

            client.updateTask(item)
                .then(
                    () => {setUpdated(true)}
                    )


        }).catch(err => console.log(err));

        navigate('/tasks');
    }

    const title = <h2>{item.id ? 'Edit Task' : 'Add Task'}</h2>;

    return (
        <div>
        <Snackbar open={updated} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}>
            <Alert severity="success" sx={{ width: '100%' }} onClose={handleClose}>
                Campaign updated successfully!
            </Alert>
        </Snackbar>
        <AppNavbar/>
        <Container className={'pt-5'}>
            {title}

            <FormControl fullWidth sx={{ mt: 5 }}>
                    <InputLabel id="kind-label">Kind</InputLabel>
                    <Select
                        id="kind"
                        name="kind"
                        value={item.kind || ''}
                        label="Kind"
                        onChange={handleChange}
                    >
                        <MenuItem value={"CREATE"}>Create</MenuItem>
                        <MenuItem value={"CORRECT"}>Correct</MenuItem>
                        <MenuItem value={"REVIEW"}>Review</MenuItem>
                    </Select>
            </FormControl>

            <FormControl fullWidth>
                <FormControlLabel control={<Checkbox name="read_only" id="read_only" checked={item.read_only} onChange={handleChange}/>} label="Read only" />
            </FormControl>

            <FormControl fullWidth>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={item?.campaign?.annotators}
                    getOptionLabel={(option) => option.username}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Assignee" />}
                />
            </FormControl>

                <AnnotationTaskList tasks={item.annotation_tasks}/>
            {params.id !== 'new' &&
            <>
                <SampleList samples={item.samples}/>
                <AnnotationList annotations={item.annotations}/>
            </>
            }

            <FormGroup sx={{ mt: 5 }}>

                <Stack direction="row" spacing={2}>
                    <Button color="primary" onClick={e => handleSubmit(e)}>Save</Button>
                    <Button component={RouterLink} color="secondary" to={"/tasks"}>Cancel</Button>
                    {params.id !== 'new' && item.campaign_status === 'RUNNING' &&
                    <Button color="success"
                            onClick={() => window.open("https://dev.visian.org/?origin=who&taskId=" + item.id, "_blank")}>Annotate</Button>
                    }
                </Stack>

            </FormGroup>
        </Container>
    </div>
    )
}

export default TaskEdit;
