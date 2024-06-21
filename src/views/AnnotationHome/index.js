import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

class AnnotationHome extends Component {
  render() {
    return (
      <>
        <Container maxWidth='xl' sx={{ mt: 5 }}>
          <Grid
            container
            spacing={2}
            direction='row'
            justifyContent='space-evenly'
            alignItems='stretch'
            sx={{ mt: 5 }}
          >
            <Grid item xs={12}>
              <h1 className='header'>Welcome To The FG-AI4H Annotation Tool</h1>
            </Grid>
            <Grid item xs={12}>
              <h5>Please choose an option</h5>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    Campaigns
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Manage annotation campaigns.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={RouterLink}
                    variant='primary'
                    to='/campaigns'
                  >
                    Campaigns
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    My Tasks
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    View all my tasks and work on them.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={RouterLink}
                    variant='primary'
                    to='/myTasks'
                  >
                    My Tasks
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    Tasks
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    List all tasks and get statistics about them.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={RouterLink} variant='primary' to='/tasks'>
                    Tasks
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}
export default AnnotationHome;
