import React, { useEffect, useState } from "react";

import { Auth } from "aws-amplify";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import UserClient from "../../api/UserClient";

import { Add } from "@mui/icons-material";
import {
    Backdrop,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField
} from "@mui/material";
import { TabPanel } from "../../components/TabPanel";
import { a11yProps } from "../../components/allyProps";

const UserEdit = (_props) => {

    let params = useParams();
    const navigate = useNavigate();

    const emptyItem = {
        name: '',
        email: '',
        annotation_annotator_role: false,
        annotation_reviewer_role: false,
        annotation_supervisor_role: false
    };

    const [item, setItem] = useState(emptyItem);
    const [isLoading, setIsLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    //Load at page load
    useEffect(() => {
        setIsLoading(true);
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            if (params.id !== 'new') {
                const client = new UserClient(response.signInUserSession.accessToken.jwtToken);
                client.fetchUserById(params.id)
                    .then(
                        res => {

                            let user = res?.data;
                            user.annotation_annotator_role = user.annotator_role?.id !== undefined
                            if(!user.annotation_annotator_role){
                                user.annotator_role = {}
                            }
                            user.annotation_reviewer_role = user.reviewer_role?.id !== undefined
                            if(!user.annotation_reviewer_role){
                                user.reviewer_role = {}
                            }
                            user.annotation_supervisor_role = user.supervisor_role?.id !== undefined
                            if(!user.annotation_supervisor_role){
                                user.supervisor_role = {}
                            }

                            setItem(user);
                            setIsLoading(false);
                        });
            }
            setIsLoading(false);
        }).catch(err => console.log(err));

    }, [params.id])

    const handleTabChange = (_event, newValue) => {
        setTabValue(newValue);
    };

    function handleChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if(target.type === 'checkbox'){
            value = target.checked;
        }

        let user = {...item};
        if(name.startsWith('annotator_role.')){
            user.annotator_role[name.replace('annotator_role.', '')] = value
        }
        else{
            user[name] = value;
        }

        setItem(user);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if(!item.annotation_annotator_role){
            item.annotator_role = undefined;
        }
        if(!item.annotation_reviewer_role){
            item.reviewer_role = undefined;
        }
        if(!item.annotation_supervisor_role){
            item.supervisor_role = undefined;
        }

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new UserClient(response.signInUserSession.accessToken.jwtToken);
            if(item.id) {
                client.updateUser(item)
                    .then(
                        res => setItem(res?.data)
                        );
            }
            else{
                client.addUser(item)
                    .then(
                            res => setItem(res?.data));
            }
        }).catch(err => console.log(err));

        navigate('/userManagement');
    }


    return (
        <div>
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="xl" sx={{ mt: 5 }}>
            <h2>{item.id ? 'Edit User' : 'Add User'}</h2>
            <Grid item xs={12}>
                    <FormControl fullWidth margin={"normal"} >
                        <TextField
                            id="username"
                            name="username"
                            value={item.username || ''}
                            label="Username"
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl fullWidth margin={"normal"} >
                        <TextField
                            type={"email"}
                            id="email"
                            name="email"
                            value={item.email || ''}
                            label="Email"
                            onChange={handleChange}
                        />
                    </FormControl>

                    <Stack direction="row" spacing={2}>
                        <Button color="primary" onClick={e => handleSubmit(e)}>Save</Button>
                        <Button component={RouterLink} color="secondary" to="/userManagement">Back</Button>
                    </Stack>

            </Grid>
            <Grid item xs={12}>
                    <h3>Roles</h3>

                <Grid item xs={6}>
                            <h4>Annotation Platform</h4>
                            <FormControl fullWidth margin={"normal"}>
                                <FormControlLabel control={<Checkbox name="annotation_annotator_role" id="annotation_annotator_role" defaultValue={false} checked={item.annotation_annotator_role} onChange={handleChange}/>} label="Annotator" />
                                <FormControlLabel control={<Checkbox name="annotation_reviewer_role" id="annotation_reviewer_role" defaultValue={false} checked={item.annotation_reviewer_role} onChange={handleChange}/>} label="Reviewer" />
                                <FormControlLabel control={<Checkbox name="annotation_supervisor_role" id="annotation_supervisor_role" checked={item.annotation_supervisor_role} onChange={handleChange}/>} label="Supervisor" />
                                <FormControlLabel control={<Checkbox name="annotation_manager_role" id="annotation_manager_role" checked={item.annotation_manager_role} onChange={handleChange}/>} label="Campaign Manager" />
                                <FormControlLabel control={<Checkbox name="annotation_admin_role" id="annotation_admin_role" checked={item.annotation_admin_role} onChange={handleChange}/>} label="Admin" />
                            </FormControl>

                </Grid>
                <Grid item xs={6}>


                            <h4>Data Platform</h4>
                            <FormControl fullWidth>
                                <FormControlLabel control={<Checkbox name="data_admin_role" id="data_admin_role" checked={item.data_admin_role} onChange={handleChange}/>} label="Admin" />
                            </FormControl>
                </Grid>

            </Grid>
            <Grid item xs={12}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="wrapped label tabs example"
                        >
                            <Tab label="Profile" {...a11yProps(0)}/>
                            <Tab label="Annotation Platform" {...a11yProps(1)}/>
                            <Tab label="Data Platform" {...a11yProps(2)}/>
                        </Tabs>
                    </Box>
                    <TabPanel value={tabValue} index={0}>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin={"normal"} >
                                <TextField
                                    type={"date"}
                                    id="birthdate"
                                    name="birthdate"
                                    value={item.birthdate}
                                    label="Birthdate"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleChange}
                                />
                            </FormControl>

                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin={"normal"}>
                                <InputLabel id="kind-label">Degree</InputLabel>
                                <Select
                                    id="degree"
                                    name="degree"
                                    value={item.degree}
                                    label="Kind"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"1"}>Associate</MenuItem>
                                    <MenuItem value={"2"}>Bachelor</MenuItem>
                                    <MenuItem value={"3"}>Master</MenuItem>
                                    <MenuItem value={"4"}>Doctoral</MenuItem>
                                </Select>
                            </FormControl>



                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth margin={"normal"}
                                       id="study_country"
                                       name="study_country"
                                       value={item.study_country}
                                       label="Study Country"
                                       InputLabelProps={{ shrink: true }}
                                       onChange={handleChange}
                            />
                            <Grid item xs={12}>

                                <TextField fullWidth margin={"normal"}
                                           id="work_country"
                                           name="work_country"
                                           value={item.study_country}
                                           label="Working Country"
                                           InputLabelProps={{ shrink: true }}
                                           onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth margin={"normal"}
                                           type={"number"}
                                           id="years_in_practice"
                                           name="years_in_practice"
                                           value={item.years_in_practice}
                                           label="Years in practice"
                                           InputLabelProps={{ shrink: true }}
                                           onChange={handleChange}
                                />

                            </Grid>
                            <Grid item xs={6}>

                                <TextField fullWidth margin={"normal"}
                                           id="timezone"
                                           name="timezone"
                                           value={item.timezone}
                                           label="Timezone"
                                           InputLabelProps={{ shrink: true }}
                                           onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    {(item.annotation_annotator_role || item.annotation_reviewer_role || item.annotation_supervisor_role || item.annotation_manager_role || item.annotation_admin_role) &&
                    <TabPanel value={tabValue} index={1}>
                        <Grid item xs={6}>
                            <Grid item xs={12} className="d-flex align-items-end">

                                <Stack direction="row" spacing={2}>
                                    <IconButton ><Add/>&nbsp;Expertise</IconButton>
                                </Stack>

                            </Grid>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField fullWidth margin={"normal"}
                                       type={"number"}
                                       id="availabilityPerWeek"
                                       name="availabilityPerWeek"
                                       value={item.annotator_role.availability_per_week}
                                       label="Availability per week (hours)"
                                       onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth margin={"normal"}
                                       type={"number"}
                                       id="annotator_role.self_assessment"
                                       name="annotator_role.self_assessment"
                                       value={item.annotator_role.self_assessment}
                                       label="Self Assessment"
                                       onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth margin={"normal"}
                                       type={"number"}
                                       id="expected_salary"
                                       name="expected_salary"
                                       value={item.annotator_role.expected_salary}
                                       label="Expected compensation ($ per hour)"
                                       onChange={handleChange}
                            />

                        </Grid>
                    </TabPanel>
                    }
                    {item.data_admin_role &&
                        <TabPanel value={tabValue} index={2}>
                            <Grid xs={12}>
                            </Grid>
                        </TabPanel>
                    }


                    <Stack direction="row" spacing={2}>
                        <Button color="primary" onClick={e => handleSubmit(e)}>Save</Button>
                        <Button component={RouterLink} color="secondary" to="/userManagement">Back</Button>
                    </Stack>
                </Box>

            </Grid>
        </Container>
    </div>
    );

}
export default UserEdit;
