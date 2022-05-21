import React, {useEffect, useState} from "react";
import AppNavbar from "./AppNavbar";

import {Link as RouterLink, useParams} from "react-router-dom";
import {Auth} from "aws-amplify";
import UserClient from "./api/UserClient";

import {
    Box,
    Button,
    Checkbox,
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
import {Add} from "@mui/icons-material";
import {a11yProps} from "./components/allyProps";
import {TabPanel} from "./components/TabPanel";
import OCISpinner from "./components/OCISpinner";

const UserEdit = (props) => {

    let params = useParams();

    const emptyItem = {
        name: '',
        email: ''
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
                        response => {

                            let user = response?.data;
                            user.annotation_annotator_role = user.annotatorRole != undefined
                            user.yearsInPractice = user.annotatorRole?.yearsInPractice
                            user.degree = user.annotatorRole?.degree
                            user.workCountry = user.annotatorRole?.workCountry
                            user.studyCountry = user.annotatorRole?.studyCountry
                            user.selfAssessment = user.annotatorRole?.selfAssessment
                            user.expectedSalary = user.annotatorRole?.expectedSalary


                            user.annotation_reviewer_role = user.reviewerRole != undefined
                            user.annotation_supervisor_role = user.supervisorRole != undefined

                            setItem(user);
                            setIsLoading(false);
                        });
            }

        }).catch(err => console.log(err));

    }, [params.id])

    const handleTabChange = (event, newValue) => {
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
        user[name] = value;
        setItem(user);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if(item.annotation_annotator_role){
            item.annotatorRole = {
                yearsInPractice: item.yearsInPractice,
                workCountry: item.workCountry,
                studyCountry: item.studyCountry,
                selfAssessment: item.selfAssessment,
                expectedSalary: item.expectedSalary,
                degree: item.degree
            }
        }
        if(item.annotation_reviewer_role){
            item.reviewerRole = {

            }
        }
        if(item.annotation_supervisor_role){
            item.supervisorRole = {

            }
        }

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new UserClient(response.signInUserSession.accessToken.jwtToken);
            if(item.userUUID) {
                client.updateUser(item)
                    .then(
                        response => setItem(response?.data)
                        );
            }
            else{
                client.addUser(item)
                    .then(
                            response => setItem(response?.data));
            }
        }).catch(err => console.log(err));


        props.history.push('/userManagement');
    }

    if (isLoading) {
        return (<OCISpinner/>);
    }

    return (
        <div>
        <AppNavbar/>
            <Container maxWidth="xl" sx={{ mt: 5 }}>
            <h2>{item.userUUID ? 'Edit User' : 'Add User'}</h2>
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
                                <FormControlLabel control={<Checkbox name="annotation_annotator_role" id="annotation_annotator_role" checked={item.annotation_annotator_role} onChange={handleChange}/>} label="Annotator" />
                                <FormControlLabel control={<Checkbox name="annotation_reviewer_role" id="annotation_reviewer_role" checked={item.annotation_reviewer_role} onChange={handleChange}/>} label="Reviewer" />
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
                                    onChange={handleChange}
                                />
                            </FormControl>

                        </Grid>
                    </TabPanel>
                    {(item.annotation_annotator_role || item.annotation_reviewer_role || item.annotation_supervisor_role || item.annotation_manager_role || item.annotation_admin_role) &&
                    <TabPanel value={tabValue} index={1}>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin={"normal"}>
                                <InputLabel id="kind-label">Degree</InputLabel>
                                <Select
                                    id="degree"
                                    name="degree"
                                    value={item.degree}
                                    label="Kind"
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
                                       id="studyCountry"
                                       name="studyCountry"
                                       value={item.studyCountry}
                                       label="Study Country"
                                       onChange={handleChange}
                            />
                            <Grid item xs={12}>

                                <TextField fullWidth margin={"normal"}
                                           id="workCountry"
                                           name="workCountry"
                                           value={item.studyCountry}
                                           label="Working Country"
                                           onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth margin={"normal"}
                                           type={"number"}
                                           id="yearsInPractice"
                                           name="yearsInPractice"
                                           value={item.yearsInPractice}
                                           label="Years in practice"
                                           onChange={handleChange}
                                />

                            </Grid>
                            <Grid item xs={12} className="d-flex align-items-end">

                                <Stack direction="row" spacing={2}>
                                    <IconButton ><Add/>&nbsp;Expertise</IconButton>
                                </Stack>

                            </Grid>
                        </Grid>
                        <Grid item xs={6}>

                            <TextField fullWidth margin={"normal"}
                                       id="timezone"
                                       name="timezone"
                                       value={item.timezone}
                                       label="Timezone"
                                       onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth margin={"normal"}
                                       type={"number"}
                                       id="availabilityPerWeek"
                                       name="availabilityPerWeek"
                                       value={item.availabilityPerWeek}
                                       label="Availability per week (hours)"
                                       onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth margin={"normal"}
                                       type={"number"}
                                       id="selfAssessment"
                                       name="selfAssessment"
                                       value={item.selfAssessment}
                                       label="Self Assessment"
                                       onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth margin={"normal"}
                                       type={"number"}
                                       id="expectedSalary"
                                       name="expectedSalary"
                                       value={item.expectedSalary}
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
