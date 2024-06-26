import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  FormGroup,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import AdminClient from '../../api/AdminClient';
import { AnnotationTaskList } from '../../components';

const emptyItem = {
  name: '',
  description: '',
  editor: '',
  id: undefined,
  annotationTasks: [],
};

const AnnotationToolEdit = (_props) => {
  let params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState(emptyItem);
  const [updated, setUpdated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((response) => {
        if (params.id !== 'new') {
          const client = new AdminClient(
            response.signInUserSession.accessToken.jwtToken
          );

          client.fetchAnnotationToolById(params.id).then((res) => {
            setItem(res.data);
            setIsLoading(false);
          });
        }
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setUpdated(false);
  }

  function handleChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    if (target.type === 'checkbox') {
      value = target.checked;
    }

    let tool = { ...item };
    tool[name] = value;
    setItem(tool);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((response) => {
        const client = new AdminClient(
          response.signInUserSession.accessToken.jwtToken
        );
        if (item.id) {
          client
            .updateAnnotationTool(item)
            .then((_response) => setUpdated(true));
        } else {
          client.addAnnotationTool(item).then((res) => {
            setIsLoading(false);
            setItem(res?.data);
            navigate('/annotationTools/' + res.data.headers.get('location'));
          });
        }
      })
      .catch((err) => console.log(err));
  }

  const title = (
    <h2>{item.id ? 'Edit Annotation Tool' : 'Add Annotation Tool'}</h2>
  );

  return (
    <div>
      <Backdrop open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Snackbar
        open={updated}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert severity='success' sx={{ width: '100%' }} onClose={handleClose}>
          Annotation tool updated successfully!
        </Alert>
      </Snackbar>
      <Container className={'pt-5'}>
        {title}

        <TextField
          fullWidth
          margin={'normal'}
          label='Name'
          name='name'
          required
          value={item.name}
          onChange={(event) => handleChange(event)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          margin={'normal'}
          label='Description'
          name='description'
          multiline
          required
          rows={4}
          value={item.description}
          onChange={(event) => handleChange(event)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          margin={'normal'}
          label='Editor'
          name='editor'
          required
          value={item.editor}
          onChange={(event) => handleChange(event)}
          InputLabelProps={{ shrink: true }}
        />

        <AnnotationTaskList tasks={item.annotation_tasks} />

        <FormGroup sx={{ mt: 5 }}>
          <Stack direction='row' spacing={2}>
            <Button color='primary' onClick={(e) => handleSubmit(e)}>
              Save
            </Button>
            <Button
              component={RouterLink}
              color='secondary'
              to={'/annotationTools'}
            >
              Cancel
            </Button>
          </Stack>
        </FormGroup>
      </Container>
    </div>
  );
};
export default AnnotationToolEdit;
