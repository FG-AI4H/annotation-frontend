import React, {useEffect, useState} from 'react';
import AppNavbar from './AppNavbar';
import {Link as RouterLink, useParams} from 'react-router-dom';
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

const emptyItem = {
    name: '',
    email: '',
    taskUUID: undefined,
    readOnly: true,
    annotationTasks: [],
    annotations: []
};

const TaskEdit = (props) => {

    let params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState(emptyItem);
    const [updated, setUpdated] = useState(false);

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
        setItem(item);
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


        props.history.push('/tasks');
    }

    const title = <h2>{item.taskUUID ? 'Edit Task' : 'Add Task'}</h2>;

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
                        <MenuItem value={"create"}>Create</MenuItem>
                        <MenuItem value={"correct"}>Correct</MenuItem>
                        <MenuItem value={"review"}>Review</MenuItem>
                    </Select>
            </FormControl>

            <FormControl fullWidth>
                <FormControlLabel control={<Checkbox name="readOnly" id="readOnly" checked={item.readOnly} onChange={handleChange}/>} label="Read only" />
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

                <AnnotationTaskList tasks={item.annotationTasks}/>
                <SampleList samples={item.samples}/>
                <AnnotationList annotations={item.annotations}/>

            <FormGroup sx={{ mt: 5 }}>

                <Stack direction="row" spacing={2}>
                    <Button color="primary" onClick={e => handleSubmit(e)}>Save</Button>
                    <Button component={RouterLink} color="secondary" to={"/tasks"}>Cancel</Button>
                    <Button color="success" onClick={()=> window.open("https://dev.visian.org/?origin=who&taskId=" + item.taskUUID, "_blank")}>Annotate</Button>
                </Stack>

            </FormGroup>
        </Container>
    </div>
    )
}
export default TaskEdit;
