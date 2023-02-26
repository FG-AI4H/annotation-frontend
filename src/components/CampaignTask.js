import React, {useState} from "react";
import Alert from "@mui/material/Alert";
import {
    Avatar, Box,
    FormControl,
    Grid, IconButton,
    InputLabel,
    List, ListItem, ListItemAvatar, ListItemText,
    MenuItem,
    Select,
    Snackbar, Stack,
    TextField,
    Typography
} from "@mui/material";
import {Auth} from "aws-amplify";
import CampaignClient from "../api/CampaignClient";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';


const CampaignTask = (props) => {

    const [campaign, setCampaign] = useState(props.campaign);
    const [updated, setUpdated] = useState(false);
    const [loading, setLoading] = useState(false);


    function handleClose(event, reason){
        if (reason === 'clickaway') {
            return;
        }

        this.setState(
            {updated: false}
        );
    }

    function handleChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if(target.type === 'checkbox'){
            value = target.checked;
        }

        campaign[name] = value;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const {campaign} = this.state;

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

            <Grid xs={12}>
                    <Typography gutterBottom variant="h5" component="div">Define your task</Typography>
                    <FormControl fullWidth margin={"normal"}>
                        <InputLabel >Task type</InputLabel>
                        <Select
                            id="annotationKind"
                            name="annotationKind"
                            value={campaign.annotationKind}
                            label="Task type"
                            onChange={handleChange}
                        >
                            <MenuItem value={"semantic_segmentation"}>[Image] - Semantic Segmentation</MenuItem>
                            <MenuItem value={"image_classification"}>[Image] - Image Classification</MenuItem>
                            <MenuItem value={"object_detection"}>[Image] - Object Detection</MenuItem>
                            <MenuItem value={"pose_estimation"}>[Image] - Pose Estimation</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin={"normal"}>
                        <InputLabel >Annotation method</InputLabel>
                        <Select
                            id="annotationMethod"
                            name="annotationMethod"
                            value={campaign.annotationMethod}
                            label="Annotation method"
                            onChange={handleChange}
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
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin={"normal"}>
                        <InputLabel >Annotation tool</InputLabel>
                        <Select
                            id="annotationTool"
                                name="annotationTool"
                            value={campaign.annotationTool}
                            label="Annotation tool"
                            onChange={handleChange}
                        >
                            <MenuItem value={"visian"}>[Image] - Visian</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin={"normal"}>
                        <TextField
                            multiline
                            rows={4}
                            id="annotationInstructions"
                            name="annotationInstructions"
                            value={campaign.annotationInstructions || ''}
                            label="Annotation instructions"
                            onChange={handleChange}
                        />
                    </FormControl>

                <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                    <Typography gutterBottom variant="h5" component="div">Annotation Guidelines</Typography>
                    <IconButton edge="end" aria-label="add"><AddIcon /></IconButton>
                </Stack>

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

            </Grid>



        </div>


    );

}
export default CampaignTask;
