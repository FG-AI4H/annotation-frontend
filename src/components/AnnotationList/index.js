import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import {
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import TaskClient from '../../api/TaskClient';

const AnnotationList = (props) => {
  async function remove(id) {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((response) => {
        const client = new TaskClient(
          response.signInUserSession.accessToken.jwtToken
        );

        client.removeAnnotation(id).then(() => {
          let updatedTasks = [...props.annotations].filter(
            (i) => i.annotationUUID !== id
          );
          props.annotations = updatedTasks;
        });
      })
      .catch((err) => console.log(err));
  }

  if (!props.annotations) {
    return <div></div>;
  }

  const annotationList = props.annotations.map((annotation) => {
    return (
      <TableRow
        key={annotation.annotationUUID}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell style={{ whiteSpace: 'nowrap' }}>
          {annotation.status}
        </TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>
          {annotation.submittedAt
            ? new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
              }).format(Date.parse(annotation.submittedAt))
            : ''}
        </TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>
          {annotation.annotator.username}
        </TableCell>
        <TableCell>
          <Stack direction={'row'} spacing={2} justifyContent='flex-end'>
            <Button
              component={RouterLink}
              size='small'
              to={'/annotations/' + annotation.annotationUUID}
            >
              Edit
            </Button>
            <Button
              size='small'
              color={'error'}
              onClick={() => remove(annotation.annotationUUID)}
            >
              Delete
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <div>
      <Container className={'pt-5'}>
        <h3>Annotations</h3>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell width={'10%'}>Status</TableCell>
                <TableCell width={'30%'}>Submitted At</TableCell>
                <TableCell width={'30%'}>Annotator</TableCell>
                <TableCell width={'30%'} align={'right'}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{annotationList}</TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};
export default AnnotationList;
