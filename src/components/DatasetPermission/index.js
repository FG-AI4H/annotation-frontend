import { Table, TableBody } from '@aws-amplify/ui-react';
import {
  Button,
  Paper,
  Stack,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Auth } from 'aws-amplify';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DatasetClient from '../../api/DatasetClient';
import withNavigateHook from '../../helpers/withNavigateHook';

const DatasetPermission = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataset, setDataset] = useState(props.dataset);
  const [usernameSearch, setUsernameSearch] = useState('');
  const [permisions, setPermissions] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((response) => {
        const datasetClient = new DatasetClient(
          response.signInUserSession.accessToken.jwtToken
        );
        datasetClient
          .fetchDatasetPermissionsById(dataset.id)
          .then((response) => {
            setIsLoading(false);
            setPermissions(response?.data);
          });
      })
      .catch((err) => console.log(err));
  }, [props.dataset]);

  function handleChange(event) {
    return undefined;
  }

  function handleSubmit(e) {
    return undefined;
  }

  function removePermission(id) {
    return undefined;
  }

  const permisionList = permisions?.map((item) => {
    return (
      <TableRow
        key={item.photoKey}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell style={{ whiteSpace: 'nowrap' }}>{item.username}</TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>{item.user_role}</TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>
          <Stack direction='row' spacing={2} justifyContent='flex-end'>
            <Button
              size='small'
              color='error'
              onClick={() => removePermission(item.id)}
            >
              Remove
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <>
      <Typography gutterBottom variant='h5' component='div'>
        Add Permission
      </Typography>
      <TextField
        fullWidth
        margin={'normal'}
        label='Search username'
        required
        value={usernameSearch}
        onChange={(event) => handleChange(event)}
        InputLabelProps={{ shrink: true }}
      />

      <Stack direction='row' spacing={2}>
        <Button color='primary' onClick={(e) => handleSubmit(e)}>
          Search
        </Button>
      </Stack>

      <Typography gutterBottom variant='h5' component='div' sx={{ mt: 10 }}>
        Current Permissions
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell width={'50%'}>Username</TableCell>
              <TableCell width={'30%'}>Role</TableCell>
              <TableCell width={'20%'} align={'right'}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{permisionList}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
DatasetPermission.propTypes = {
  dataset: PropTypes.any,
};
export default withNavigateHook(DatasetPermission);
