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
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { API_ROUTES } from '../../common/constants/apiRoutes';
import withNavigateHook from '../../helpers/withNavigateHook';
import useFetch from '../../hooks/useFetch';
import UserPermissionList from './UserPermissionList';

const DatasetPermission = (props) => {
  const { axiosBase } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [dataset, setDataset] = useState(props.dataset);
  const [usernameSearch, setUsernameSearch] = useState('');
  const [permisions, setPermissions] = useState([]);
  const [userList, setUserList] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);
  const [addedPermissions, setAddedPermission] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axiosBase.get(
          API_ROUTES.GET_PERMISSION_LIST.replace(':datasetId', dataset?.id)
        );
        setPermissions(res?.data);

        const resUser = await axiosBase.get(API_ROUTES.USER_URL);
        const mappedUser = resUser?.data?.map((item) => {
          const foundItem = res?.data?.find((u) => u?.user === item?.id);
          if (foundItem) {
            return {
              ...item,
              user_role: foundItem?.user_role,
              role_id: foundItem?.id,
            };
          }
          return item;
        });

        console.log(mappedUser);
        setUserList(mappedUser);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset?.id]);

  function handleChange(event) {
    setUsernameSearch(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const foundUserList = userList?.filter((item) =>
      item?.username?.toLowerCase()?.includes(usernameSearch?.toLowerCase())
    );
    setFoundUsers(foundUserList);
  }

  function removePermission(id) {
    return undefined;
  }

  const handleSubmitPermission = () => {
    console.log(addedPermissions);
  };

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
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin={'normal'}
          label='Search username'
          required
          value={usernameSearch}
          onChange={(event) => handleChange(event)}
          InputLabelProps={{ shrink: true }}
          helperText={`${foundUsers?.length}/${userList?.length} results found`}
        />

        <Stack direction='row' spacing={2}>
          <Button color='primary' elementType={'submit'} type={'submit'}>
            Search
          </Button>
        </Stack>
      </form>

      <UserPermissionList users={foundUsers} onSubmit={(e) => console.log(e)} />
      <Stack direction='row' spacing={2} sx={{ marginTop: '20px' }}>
        <Button
          variant='outlined'
          color='primary'
          onClick={handleSubmitPermission}
        >
          Add Permissions
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
