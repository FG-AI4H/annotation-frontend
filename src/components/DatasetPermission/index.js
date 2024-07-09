import { Table, TableBody } from '@aws-amplify/ui-react';
import {
  Backdrop,
  Button,
  CircularProgress,
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
import React, { useEffect, useMemo, useState } from 'react';
import { API_ROUTES } from '../../common/constants/apiRoutes';
import withNavigateHook from '../../helpers/withNavigateHook';
import useFetch from '../../hooks/useFetch';
import { generateUpdatePermissionPayload, getArray } from '../../utils/common';
import UserPermissionList from './UserPermissionList';
import {
  addPermission,
  deletePermission,
  getPermissionList,
  updatePermission,
} from '../../api/dataset.service';

const DatasetPermission = (props) => {
  const { axiosBase } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const dataset = useMemo(() => props.dataset, [props.dataset]);
  const [usernameSearch, setUsernameSearch] = useState('');
  const [permisions, setPermissions] = useState([]);
  const [userList, setUserList] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let res = [];
        if (dataset?.id) {
          const res = await getPermissionList({ id: dataset?.id }, axiosBase);
          setPermissions(res);
        }

        const resUser = await axiosBase.get(API_ROUTES.USER_URL);
        const mappedUser = resUser?.data?.map((item) => {
          const foundItem = getArray(res)?.find((u) => u?.user === item?.id);
          if (foundItem) {
            return {
              ...item,
              user_role: foundItem?.user_role,
              role_id: foundItem?.id,
            };
          }
          return item;
        });

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

  async function removePermission(id) {
    const res = await deletePermission({ id }, axiosBase);

    const resPermission = await getPermissionList(
      { id: dataset?.id },
      axiosBase
    );
    setPermissions(resPermission);

    return res;
  }

  const handleSubmitPermission = async (data) => {
    const payload = generateUpdatePermissionPayload({
      ...data,
      dataset: dataset?.id,
    });
    const res = data?.user_role
      ? await updatePermission(payload, axiosBase)
      : await addPermission(payload, axiosBase);

    const resPermission = await getPermissionList(
      { id: dataset?.id },
      axiosBase
    );
    setPermissions(resPermission);

    return res;
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
      <Backdrop open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>

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

      <UserPermissionList
        users={foundUsers}
        onSubmit={handleSubmitPermission}
      />

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
