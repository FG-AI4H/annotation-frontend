import React, { useEffect } from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getUserInfo } from '../../api/common.service';
import useFetch from '../../hooks/useFetch';

export default function Home() {
  const { axiosBase } = useFetch();

  useEffect(() => {
    (async () => {
      let userInfo = localStorage.getItem('user');
      userInfo = JSON.parse(userInfo || null);
      if (!userInfo) {
        const user = await getUserInfo(axiosBase);
        console.log(user);
        user && localStorage.setItem('user', JSON.stringify(user));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Container maxWidth='xl' sx={{ mt: 5 }}>
        <div className='mui-row'>
          <div className='mui-col-md-12'>
            <h1 className='header'>Welcome To The FG-AI4H Platform</h1>
          </div>
        </div>
        <div className='mui-row'>
          <div className='mui-col-md-12'>
            <h5>Welcome To The FG-AI4H Platform</h5>
          </div>
        </div>

        <Grid
          container
          spacing={2}
          direction='row'
          justifyContent='space-evenly'
          alignItems='stretch'
          sx={{ mt: 5 }}
        >
          <Grid item xs={12} md={4}>
            <Card sx={{ height: 1 }}>
              <CardMedia
                component='img'
                height='180'
                image='home_datasets.png'
                sx={{ objectPosition: 'right' }}
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Data Platform
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Provides safe and secure storage of medical data; serves as an
                  interface to access this data; and offers data governance that
                  complies with data protection laws. Medical data storage
                  requires adherence to strict guidelines that preserve the
                  privacy and safety of patients. The Data Platform provides
                  data storage guidelines that consider these constraints.
                  <br />
                  <br />
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={RouterLink} color='primary' to='/datasets'>
                  Manage Data
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: 1 }}>
              <CardMedia
                component='img'
                height='180'
                image='home_annotation.png'
                sx={{ objectPosition: 'right' }}
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Annotation Platform
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  High-quality annotated data provide the basis for supervised
                  learning. Unfortunately, production is challenging and labor
                  intensive. Certain features must be considered when evaluating
                  an annotation: the quality of labels, the number of expert
                  opinions, and the handling of non-unanimous decisions. This
                  Annotation Platform brings together leading health experts
                  across the globe to produce the highest-quality annotations at
                  maximum efficiency.
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={RouterLink} color='primary' to='/annotation'>
                  Start Annotation
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component='img'
                height='180'
                image='home_eval.png'
                sx={{ objectPosition: 'right' }}
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Evaluation Platform
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Evaluating AI models in health - The ITU/WHO Focus Group on
                  artificial intelligence for health (FG-AI4H) works in
                  partnership with the World Health Organization (WHO) to
                  establish a standardized assessment framework for the
                  evaluation of AI-based methods for health, diagnosis, triage
                  or treatment decisions. The group was established by ITU-T
                  Study Group 16 at its meeting in Ljubljana, Slovenia, 9-20
                  July 2018.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  color='primary'
                  onClick={() =>
                    window.open(
                      'https://health.aiaudit.org/',
                      '_blank',
                      'noopener'
                    )
                  }
                >
                  Start Evaluation
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
