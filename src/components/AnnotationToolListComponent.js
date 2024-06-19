import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import AdminClient from '../api/AdminClient';
import {
  Backdrop,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AnnotationToolListComponent = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [annotationToolList, setAnnotationToolList] = useState([]);

  useEffect(() => {
    setLoading(true);
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((response) => {
        const adminCLient = new AdminClient(
          response.signInUserSession.accessToken.jwtToken
        );
        adminCLient.fetchAnnotationToolList().then((response) => {
          if (response?.data) {
            setAnnotationToolList(response?.data);
          }
          setLoading(false);
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const toolList = annotationToolList?.map((tool) => {
    return (
      <TableRow
        key={tool.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell style={{ whiteSpace: 'nowrap' }}>{tool.name}</TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>{tool.editor}</TableCell>
        <TableCell>
          <Stack direction={'row'} spacing={2} justifyContent='flex-end'>
            <Button
              component={RouterLink}
              size='small'
              to={'/annotation_tool/' + tool.id}
            >
              Edit
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <>
      <Backdrop open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell width={'45%'}>Name</TableCell>
              <TableCell width={'45%'}>Editor</TableCell>
              <TableCell width={'10%'} align={'right'}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{toolList}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default AnnotationToolListComponent;
