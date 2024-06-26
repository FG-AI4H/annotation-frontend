import { Table, TableBody } from "@aws-amplify/ui-react";
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
} from "@mui/material";
import { Auth } from "aws-amplify";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import DatasetClient from "../../api/DatasetClient";
import { API_ROUTES } from "../../common/constants/apiRoutes";
import withNavigateHook from "../../helpers/withNavigateHook";
import useFetch from "../../hooks/useFetch";
import UserPermissionList from "./UserPermissionList";

const DatasetPermission = (props) => {
  const { fetchAPI } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [dataset, setDataset] = useState(props.dataset);
  const [usernameSearch, setUsernameSearch] = useState("");
  const [permisions, setPermissions] = useState([]);
  const [userList, setUserList] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);
  const [addedPermissions, setAddedPermission] = useState([]);

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
  }, [dataset.id, props.dataset]);

  // Get user list
  useEffect(() => {
    (async () => {
      const res = await fetchAPI(API_ROUTES.USER_URL);
      setUserList(res);
      // setUserList([{ id: "123", username: "khoa" }]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(event) {
    setUsernameSearch(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const foundUserList = userList?.filter((item) =>
      item?.username?.includes(usernameSearch)
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
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell style={{ whiteSpace: "nowrap" }}>{item.username}</TableCell>
        <TableCell style={{ whiteSpace: "nowrap" }}>{item.user_role}</TableCell>
        <TableCell style={{ whiteSpace: "nowrap" }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              size="small"
              color="error"
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
      <Typography gutterBottom variant="h5" component="div">
        Add Permission
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin={"normal"}
          label="Search username"
          required
          value={usernameSearch}
          onChange={(event) => handleChange(event)}
          InputLabelProps={{ shrink: true }}
          helperText={`${foundUsers?.length}/${userList?.length} results found`}
        />

        <Stack direction="row" spacing={2}>
          <Button color="primary" elementType={"submit"} type={"submit"}>
            Search
          </Button>
        </Stack>
      </form>

      <UserPermissionList
        users={foundUsers}
        onChange={(e) => setAddedPermission(e)}
      />
      <Stack direction="row" spacing={2} sx={{ marginTop: "20px" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSubmitPermission}
        >
          Add Permissions
        </Button>
      </Stack>

      <Typography gutterBottom variant="h5" component="div" sx={{ mt: 10 }}>
        Current Permissions
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={"50%"}>Username</TableCell>
              <TableCell width={"30%"}>Role</TableCell>
              <TableCell width={"20%"} align={"right"}>
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
