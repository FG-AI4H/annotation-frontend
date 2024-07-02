import React, {useEffect, useState} from "react";
import Alert from "@mui/material/Alert";
import {
    Avatar,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Auth} from "aws-amplify";
import CampaignClient from "../api/CampaignClient";
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import {Link as RouterLink} from "react-router-dom";
import PropTypes from "prop-types";


const CampaignTask = (props) => {

    const [campaign, setCampaign] = useState(props.campaign);
    const [updated, setUpdated] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setCampaign(props.campaign);
    }, [props.campaign]);

    //Update input field in "Add Dataset" Modal
    function setInput(key, value) {
        setCampaign({ ...campaign, [key]: value })
    }
    
    function handleClose(event, reason){
        if (reason === 'clickaway') {
            return;
        }

        setUpdated(false)
    }

    async function handleSubmit(event) {
        event.preventDefault();

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(response => {
            const client = new CampaignClient(response.signInUserSession.accessToken.jwtToken);

                client.updateCampaign(campaign)
                    .then(
                        response => setUpdated(true))

        }).catch(err => console.log(err));

    }

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

            <Grid>
                    <Typography gutterBottom variant="h5" component="div">Define your task</Typography>
                    <FormControl fullWidth margin={"normal"}>
                        <InputLabel >Annotation type</InputLabel>
                        <Select
                            id="annotation_kind"
                            name="annotation_kind"
                            value={campaign.annotation_kind.toLowerCase()}
                            label="Task type"
                            onChange={event => setInput('annotation_kind', event.target.value.toUpperCase())}
                        >
                            <MenuItem value={"semantic_segmentation"}>[Image] - Semantic Segmentation</MenuItem>
                            <MenuItem value={"image_classification"}>[Image] - Image Classification</MenuItem>
                            <MenuItem value={"object_detection"}>[Image] - Object Detection</MenuItem>
                            <MenuItem value={"pose_estimation"}>[Image] - Pose Estimation</MenuItem>
                            <MenuItem value={"synthetic_case"}>[Symptom] - Synthetic Case</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin={"normal"}>
                        <InputLabel >Annotation method</InputLabel>
                        <Select
                            id="annotation_method"
                            name="annotation_method"
                            value={campaign.annotation_method}
                            label="Annotation method"
                            onChange={event => setInput('annotation_method', event.target.value)}
                        >
                            <MenuItem value={"full_image"}>[Image] - Full image</MenuItem>
                            <MenuItem value={"bounding_boxes"}>[Image] - Bounding boxes</MenuItem>
                            <MenuItem value={"polygons"}>[Image] - Polygonal segmentation</MenuItem>
                            <MenuItem value={"keypoint"}>[Image] - Keypoint</MenuItem>
                            <MenuItem value={"ploylines"}>[Image] - Polylines</MenuItem>
                            <MenuItem value={"elispe_circle"}>[Image] - Elipse and circle</MenuItem>
                            <MenuItem value={"cuboid"}>[Image] - Cuboid</MenuItem>
                            <MenuItem value={"straight_lines"}>[Image] - Straight lines</MenuItem>
                            <MenuItem value={"quadratic_curves"}>[Image] - Quadratic curves</MenuItem>
                            <MenuItem value={"synthetic_case"}>[Symptom] - Synthetic Case</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin={"normal"}>
                        <InputLabel >Annotation tool</InputLabel>
                        <Select
                            id="annotation_tool"
                            name="annotation_tool"
                            value={campaign.annotation_tool}
                            label="Annotation tool"
                            onChange={event => setInput('annotation_tool', event.target.value)}
                        >
                            <MenuItem value={"visian"}>[Image] - Visian</MenuItem>
                        </Select>
                    </FormControl>

                <FormControl fullWidth margin={"normal"}>
                    <InputLabel >Pre-annotation engine</InputLabel>
                    <Select
                        id="pre_annotation_tool"
                        name="pre_annotation_tool"
                        value={campaign.pre_annotation_tool}
                        label="Pre-annotation tool"
                        onChange={event => setInput('pre_annotation_tool', event.target.value)}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"hpi"}>HPI</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                    <InputLabel >Pre-annotation model</InputLabel>
                    <Select
                        id="pre_annotation_model"
                        name="pre_annotation_model"
                        value={campaign.pre_annotation_model}
                        label="Pre-annotation model"
                        disabled={!campaign.pre_annotation_tool}
                        onChange={event => setInput('pre_annotation_model', event.target.value)}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"hpi_v1"}>HPI_V1</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                    <InputLabel >Quality control</InputLabel>
                    <Select
                        id="quality_assurance"
                        name="quality_assurance"
                        value={campaign.quality_assurance}
                        label="Quality control"
                        onChange={event => setInput('quality_assurance', event.target.value)}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"SELF"}>Self-review</MenuItem>
                        <MenuItem value={"PEER"}>Peer-review</MenuItem>
                        <MenuItem value={"AUTOMATED"}>Automated-cheks</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                    <TextField type={'number'} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                               id="min_annotation"
                               name="min_annotation"
                               value={campaign.min_annotation}
                               label={'Minimum number of annotations per dataset item'}
                               onChange={event => setInput('min_annotation', event.target.value)}/>

                </FormControl>

                    <FormControl fullWidth margin={"normal"}>
                        <TextField
                            multiline
                            rows={4}
                            id="annotation_instructions"
                            name="annotation_instructions"
                            value={campaign.annotation_instructions || ''}
                            label="Annotation instructions"
                            onChange={event => setInput('annotation_instructions', event.target.value)}
                        />
                    </FormControl>

                <Stack direction="row" spacing={2}>
                    <Button color="primary" onClick={e => handleSubmit(e)}>Save</Button>
                    <Button component={RouterLink} color="secondary" to="/campaigns">Cancel</Button>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                    <Typography gutterBottom variant="h5" component="div">Annotation Guidelines</Typography>
                </Stack>
                <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                    <Button component={RouterLink} color="success" to={"/campaigns/new"}>Add guideline</Button>
                </Box>

                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <DescriptionIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="FG-AI4H Guideline 1" secondary="Jan 9, 2018" />
                    </ListItem>
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <DescriptionIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="FG-AI4H Guideline 2" secondary="Jan 7, 2023" />
                    </ListItem>
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <DescriptionIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="FG-AI4H Guideline 3" secondary="July 20, 2022" />
                    </ListItem>
                </List>

                <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                    <Typography gutterBottom variant="h5" component="div">Annotation Classes</Typography>

                </Stack>
                <Box sx={{ display: 'flex',justifyContent: 'flex-end' }}>
                    <Button component={RouterLink} color="success" to={"/campaigns/new"}>Add class label</Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={"30%"}>Name</TableCell>
                                <TableCell width={"40%"}>Description</TableCell>
                                <TableCell width={"10%"} align={"right"}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {campaign.class_label}
                        </TableBody>
                    </Table>
                </TableContainer>
                <FormControlLabel control={<Switch id="is_instance_label"
                                                   name="is_instance_label"
                                                   value={campaign.is_instance_label}
                                                   onChange={event => setInput('is_instance_label', event.target.value)}/>} label="Enable instance labels" />

            </Grid>



        </div>


    );

}

CampaignTask.propTypes = {
    campaign: PropTypes.any,
};

export default CampaignTask;
