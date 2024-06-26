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
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const SampleList = (props) => {
  async function remove(id) {
    await fetch(`https://annotation.ai4h.net/samples/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => {
      let updatedTasks = [...props.samples].filter((i) => i.id !== id);
      props.samples = updatedTasks;
    });
  }

  if (!props.samples) {
    return <div></div>;
  }

  const sampleList = props.samples.map((sample) => {
    return (
      <TableRow
        key={sample.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell style={{ whiteSpace: 'nowrap' }}>{sample.title}</TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}></TableCell>
        <TableCell>
          <Stack direction={'row'} spacing={2} justifyContent='flex-end'>
            <Button
              size='small'
              color={'error'}
              onClick={() => remove(sample.id)}
            >
              Delete
            </Button>
            <Button
              component={RouterLink}
              size='small'
              color={'info'}
              to={'/imageViewer/' + sample.id}
            >
              View
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <div>
      <Container className={'pt-5'}>
        <h3>Samples</h3>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell width={'40%'}>Title</TableCell>
                <TableCell width={'30%'}>Data</TableCell>
                <TableCell width={'30%'} align={'right'}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{sampleList}</TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};
export default SampleList;
