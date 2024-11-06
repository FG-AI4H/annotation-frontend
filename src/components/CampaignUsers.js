import React, {Component} from "react";
import {Auth} from "aws-amplify";
import UserClient from "../api/UserClient";
import {
    Box,
    Button,
    FormControl,
    Grid,
    Link,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {a11yProps} from "./allyProps";
import {TabPanel} from "./TabPanel";
import OCISpinner from "./OCISpinner";

class CampaignUsers extends Component {


    annotatorFilter = {
        years_in_practice: null,
        self_assessment: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            availableUsers: [],
            campaign: {},
            annotatorFilter: this.annotatorFilter,
            tabValue: 0
        };
        this.handleAnnotatorFilterChange = this.handleAnnotatorFilterChange.bind(this);
        this.handleFindAnnotators = this.handleFindAnnotators.bind(this);
    }

    async componentDidMount() {

        this.setState({ isLoading: true, tabValue: 0, campaign:  this.props.campaign});

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {

            const userClient = new UserClient(response.signInUserSession.accessToken.jwtToken);
            userClient.fetchUserList()
                .then(
                    response => {
                        if (response?.data) {
                            this.state.annotatorDtos = this.state.campaign.annotators.map(id => response.data.filter( u => u.id === id)[0])
                            this.state.reviewerDtos = this.state.campaign.reviewers.map(id => response.data.filter( u => u.id === id)[0])
                            this.state.supervisorDtos = this.state.campaign.supervisors.map(id => response.data.filter( u => u.id === id)[0])

                            this.setState(
                                {availableUsers: response.data
                                        .filter(i => !this.state.annotatorDtos?.some(a => a.id === i.id))
                                        .filter(i => !this.state.reviewerDtos?.some(a => a.id === i.id))
                                        .filter(i => !this.state.supervisorDtos?.some(a => a.id=== i.id)),
                                    isLoading: false}
                            )}});

        }).catch(err => console.log(err));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.campaign !== this.props.campaign) {
            let updatedUsers = [...this.state.availableUsers]
                .filter(i => !this.state.annotatorDtos?.some(a => a.id === i.id))
                .filter(i => !this.state.reviewerDtos?.some(a => a.id === i.id))
                .filter(i => !this.state.supervisorDtos?.some(a => a.id === i.id));

            this.setState({campaign: this.props.campaign, availableUsers: updatedUsers});
        }
    }

    handleTabChange = (event, newValue) => {
        if(newValue !== undefined && this.state.tabValue !== newValue) {
            this.setState({tabValue: newValue})
        }
    };

    handleAnnotatorFilterChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if(target.type === 'checkbox'){
            value = target.checked;
        }

        let annotatorFilter = {...this.state.annotatorFilter};
        annotatorFilter[name] = value;
        this.setState({annotatorFilter: annotatorFilter});
    }

    handleFindAnnotators(event) {
        let updatedUsers = [...this.state.availableUsers].filter(i => i.years_in_practice >= this.state.annotatorFilter['years_in_practice']);
        this.setState({availableUsers: updatedUsers})
    }

    handleResetAnnotators(event) {
        this.componentDidMount();
        this.setState({annotatorFilter: {
                years_in_practice: null,
                self_assessment: null,
            }});
    }

    removeSelectUser(user) {
        this.state.availableUsers.push(user);
        let updatedUsers = [...this.state.campaign.annotators].filter(i => i !== user.id);
        this.state.campaign.annotators = updatedUsers;
        this.state.annotatorDtos = [...this.state.annotatorDtos].filter(i => i.id !== user.id);
        this.setState({item: this.state.campaign,availableUsers: this.state.availableUsers})
    }

    selectUser(user) {
        this.state.campaign.annotators.push(user.id);
        this.state.annotatorDtos.push(user);
        let availableUsers = [...this.state.availableUsers].filter(i => i.id !== user.id);
        this.setState({availableUsers: availableUsers});
    }

    removeSelectReviewer(user) {
        this.state.availableUsers.push(user);
        let updatedUsers = [...this.state.campaign.reviewers].filter(i => i !== user.id);
        this.state.campaign.reviewers = updatedUsers;
        this.state.reviewerDtos = [...this.state.reviewerDtos].filter(i => i.id !== user.id);
        this.setState({item: this.state.campaign,availableUsers: this.state.availableUsers})
    }

    selectReviewer(user) {
        this.state.campaign.reviewers.push(user.id);
        this.state.reviewerDtos.push(user);
        let availableUsers = [...this.state.availableUsers].filter(i => i.id !== user.id);
        this.setState({availableUsers: availableUsers});
    }

    removeSelectSupervisor(user) {
        this.state.availableUsers.push(user);
        let updatedUsers = [...this.state.campaign.supervisors].filter(i => i.id !== user.id);
        this.state.campaign.supervisors = updatedUsers;
        this.state.supervisorDtos = [...this.state.supervisorDtos].filter(i => i.id !== user.id);
        this.setState({item: this.state.campaign,availableUsers: this.state.availableUsers})
    }

    selectSupervisor(user) {
        this.state.campaign.supervisors.push(user.id);
        this.state.supervisorDtos.push(user);
        let availableUsers = [...this.state.availableUsers].filter(i => i.id !== user.id);
        this.setState({availableUsers: availableUsers});
    }

    render() {

        const {campaign, isLoading, availableUsers, annotatorFilter, tabValue, annotatorDtos, reviewerDtos, supervisorDtos} = this.state;

        if (isLoading) {
            return (<OCISpinner/>);
        }

        const availableAnnotatorList = availableUsers.filter(user => user.annotator_role?.id !== undefined).map(user => {
            return <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell style={{whiteSpace: 'nowrap'}}><Link component={RouterLink} to={"/users/" + user.id}>{user.username}</Link></TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.years_in_practice}</TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.annotator_role.self_assessment}</TableCell>
                <TableCell>
                    <Stack direction="row" spacing={2}>
                        <Button size="small" color="success" onClick={() => this.selectUser(user)}>Select</Button>
                    </Stack>
                </TableCell>
            </TableRow>
        });

        const annotatorList = annotatorDtos?.map(user => {
            return <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell style={{whiteSpace: 'nowrap'}}><Link component={RouterLink} to={"/users/" + user.id}>{user.username}</Link></TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.years_in_practice}</TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.annotator_role.self_assessment}</TableCell>

                <TableCell>
                    <Stack direction="row" spacing={2}>
                        <Button size="small" color="error" onClick={() => this.removeSelectUser(user)}>Remove</Button>
                    </Stack>
                </TableCell>
            </TableRow>
        });

        const availableReviewerList = availableUsers.filter(user => user.reviewer_role?.id !== undefined).map(user => {
            return <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell style={{whiteSpace: 'nowrap'}}><Link component={RouterLink} to={"/users/" + user.id}>{user.username}</Link></TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.years_in_practice}</TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.reviewer_role.self_assessment}</TableCell>
                <TableCell>
                    <Stack direction="row" spacing={2}>
                        <Button size="small" color="success" onClick={() => this.selectReviewer(user)}>Select</Button>
                    </Stack>
                </TableCell>
            </TableRow>
        });

        const reviewerList = reviewerDtos?.map(user => {
            return <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell style={{whiteSpace: 'nowrap'}}><Link component={RouterLink} to={"/users/" + user.id}>{user.username}</Link></TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.years_in_practice}</TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.reviewer_role.self_assessment}</TableCell>

                <TableCell>
                    <Stack direction="row" spacing={2}>
                        <Button size="small" color="error" onClick={() => this.removeSelectReviewer(user)}>Remove</Button>
                    </Stack>
                </TableCell>
            </TableRow>
        });

        const availableSupervisorList = availableUsers.filter(user => user.supervisor_role?.id !== undefined).map(user => {
            return <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell style={{whiteSpace: 'nowrap'}}><Link component={RouterLink} to={"/users/" + user.id}>{user.username}</Link></TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.years_in_practice}</TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.supervisor_role.self_assessment}</TableCell>
                <TableCell>
                    <Stack direction="row" spacing={2}>
                        <Button size="small" color="success" onClick={() => this.selectSupervisor(user)}>Select</Button>
                    </Stack>
                </TableCell>
            </TableRow>
        });

        const supervisorList = supervisorDtos?.map(user => {
            return <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell style={{whiteSpace: 'nowrap'}}><Link component={RouterLink} to={"/users/" + user.id}>{user.username}</Link></TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.years_in_practice}</TableCell>
                <TableCell style={{whiteSpace: 'nowrap'}} align={"right"}>{user.supervisor_role.self_assessment}</TableCell>

                <TableCell>
                    <Stack direction="row" spacing={2}>
                        <Button size="small" color="error" onClick={() => this.removeSelectSupervisor(user)}>Remove</Button>
                    </Stack>
                </TableCell>
            </TableRow>
        });

        return (
            <div>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={this.handleTabChange}
                        aria-label="wrapped label tabs example"
                    >
                        <Tab label="Supervisors" {...a11yProps(0)}/>
                        <Tab label="Annotators" {...a11yProps(1)}/>
                        <Tab label="Reviewers" {...a11yProps(2)}/>
                    </Tabs>
                    </Box>
                <TabPanel value={tabValue} index={0}>
                    <Grid container>
                        <Grid item xs={12}>
                            <h3>Find supervisors</h3>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>

                                <Grid item xs={6}>
                                        <FormControl fullWidth margin={"normal"}>
                                            <TextField
                                                type="number"
                                                id="years_in_practice"
                                                name="years_in_practice"
                                                value={annotatorFilter.years_in_practice || ''}
                                                label="Minimum years in practice"
                                                onChange={this.handleAnnotatorFilterChange}
                                            />
                                        </FormControl>

                                    </Grid>
                                <Grid item xs={6}>
                                        <FormControl fullWidth margin={"normal"}>
                                            <TextField
                                                type="number"
                                                id="self_assessment"
                                                name="self_assessment"
                                                value={annotatorFilter.self_assessment || ''}
                                                label="Minimum self-assessment grade"
                                                onChange={this.handleAnnotatorFilterChange}
                                            />
                                        </FormControl>
                                    </Grid>

                                <Stack direction="row" spacing={2}>
                                    <Button color="primary" onClick={() => this.handleFindAnnotators()}>Search</Button>{' '}
                                    <Button color="primary" onClick={() => this.handleResetAnnotators()}>Reset</Button>
                                </Stack>

                        </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 5 }} spacing={2}>
                        <Grid item xs={6}>
                            <h3>Available supervisors</h3>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="30%">Username</TableCell>
                                            <TableCell width="30%" align={"right"}>Years in practice</TableCell>
                                            <TableCell width="30%" align={"right"}>Self-Assessment</TableCell>
                                            <TableCell align={"right"} width="10%">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {availableSupervisorList}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={6}>
                            <h3>Selected supervisors</h3>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="30%">Username</TableCell>
                                            <TableCell width="30%" align={"right"}>Years in practice</TableCell>
                                            <TableCell width="30%" align={"right"}>Self-Assessment</TableCell>
                                            <TableCell align={"right"} width="10%">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {supervisorList}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Grid container className='mt-5'>
                        <Grid item xs={12}>
                            <h3>Find annotators</h3>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>


                            <Grid item xs={6}>
                                    <FormControl fullWidth margin={"normal"}>
                                        <TextField
                                            type="number"
                                            id="years_in_practice"
                                            name="years_in_practice"
                                            value={annotatorFilter.years_in_practice || ''}
                                            label="Minimum years in practice"
                                            onChange={this.handleAnnotatorFilterChange}
                                        />
                                    </FormControl>

                            </Grid>
                        <Grid item xs={6}>
                                    <FormControl fullWidth margin={"normal"}>
                                        <TextField
                                            type="number"
                                            id="self_assessment"
                                            name="self_assessment"
                                            value={annotatorFilter.self_assessment || ''}
                                            label="Minimum self-assessment grade"
                                            onChange={this.handleAnnotatorFilterChange}
                                        />
                                    </FormControl>
                        </Grid>
                            <Stack direction="row" spacing={2}>
                                <Button color="primary" onClick={() => this.handleFindAnnotators()}>Search</Button>
                                <Button color="primary" onClick={() => this.handleResetAnnotators()}>Reset</Button>
                            </Stack>

                    </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 5 }} spacing={2}>
                        <Grid item xs={6}>
                            <h3>Available annotators</h3>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="30%">Username</TableCell>
                                            <TableCell width="30%" align={"right"}>Years in practice</TableCell>
                                            <TableCell width="30%" align={"right"}>Self-Assessment</TableCell>
                                            <TableCell align={"right"} width="10%">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {availableAnnotatorList}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Grid>
                        <Grid item xs={6}>
                            <h3>Selected annotators</h3>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="30%">Username</TableCell>
                                            <TableCell width="30%" align={"right"}>Years in practice</TableCell>
                                            <TableCell width="30%" align={"right"}>Self-Assessment</TableCell>
                                            <TableCell align={"right"} width="10%">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {annotatorList}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Grid container className='mt-5'>
                        <Grid itemxs={12}>
                            <h3>Find reviewers</h3>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>

                                <Grid item xs={6}>
                                        <FormControl fullWidth margin={"normal"}>
                                            <TextField
                                                type="number"
                                                id="years_in_practice"
                                                name="years_in_practice"
                                                value={annotatorFilter.years_in_practice || ''}
                                                label="Minimum years in practice"
                                                onChange={this.handleAnnotatorFilterChange}
                                            />
                                        </FormControl>

                                    </Grid>
                                     <Grid item xs={6}>
                                        <FormControl fullWidth margin={"normal"}>
                                            <TextField
                                                type="number"
                                                id="self_assessment"
                                                name="self_assessment"
                                                value={annotatorFilter.self_assessment || ''}
                                                label="Minimum self-assessment grade"
                                                onChange={this.handleAnnotatorFilterChange}
                                            />
                                        </FormControl>
                                    </Grid>

                                <Stack direction="row" spacing={2}>
                                    <Button color="primary" onClick={() => this.handleFindAnnotators()}>Search</Button>{' '}
                                    <Button color="primary" onClick={() => this.handleResetAnnotators()}>Reset</Button>
                                </Stack>

                        </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 5 }} spacing={2}>
                        <Grid item xs={6}>
                            <h3>Available reviewers</h3>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="30%">Username</TableCell>
                                            <TableCell width="30%" align={"right"}>Years in practice</TableCell>
                                            <TableCell width="30%" align={"right"}>Self-Assessment</TableCell>
                                            <TableCell align={"right"} width="10%">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {availableReviewerList}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={6}>
                            <h3>Selected reviewers</h3>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="30%">Username</TableCell>
                                            <TableCell width="30%" align={"right"}>Years in practice</TableCell>
                                            <TableCell width="30%" align={"right"}>Self-Assessment</TableCell>
                                            <TableCell align={"right"} width="10%">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reviewerList}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </TabPanel>
                </Box>





            </div>
        );
    }

}
export default CampaignUsers;