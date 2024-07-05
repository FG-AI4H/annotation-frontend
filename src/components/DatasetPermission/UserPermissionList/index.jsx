import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Box,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';

const PERMISSIONS = [
  {
    label: 'Owner',
    value: 'OWNER',
  },
  {
    label: 'Reader',
    value: 'READER',
  },
  {
    label: 'Contributor',
    value: 'CONTRIBUTOR',
  },
];

export default function UserPermissionList({
  users = [],
  onChange = () => {},
  onSubmit = () => {},
}) {
  const [internalUsers, setInternalUser] = useState(users);

  const handleSelect = (e, id) => {
    const foundIdx = internalUsers?.findIndex((item) => item?.id === id);
    const tempArr = [...internalUsers];

    if (foundIdx === -1) return;
    tempArr[foundIdx].request_user_role = e?.target?.value;

    onChange(tempArr);
    setInternalUser(tempArr);
  };

  useEffect(() => {
    setInternalUser(users);
  }, [users]);

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: '100%',
        maxHeight: 400,
        overflow: 'auto',
        bgcolor: 'background.paper',
        background: users?.length ? '#1f1f1f' : 'unset',
      }}
    >
      {users?.map((value) => {
        const labelId = value?.id;
        return (
          <ListItem
            key={value?.id}
            secondaryAction={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                }}
              >
                <Box>
                  <FormControl fullWidth sx={{ width: 150 }}>
                    <Select
                      defaultValue={
                        value?.request_user_role || value?.user_role || ''
                      }
                      displayEmpty
                      onChange={(e) => {
                        handleSelect(e, value?.id);
                      }}
                      sx={{ height: '40px' }}
                    >
                      <MenuItem disabled value=''>
                        <em>Choose role</em>
                      </MenuItem>
                      {PERMISSIONS.map((item, index) => (
                        <MenuItem key={index} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Tooltip title='Grant permission' placement='top'>
                    <IconButton
                      sx={{
                        height: '40px',
                        border: 'none',
                      }}
                      variant='contained'
                      disabled={!value?.request_user_role}
                      onClick={() => onSubmit(value)}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
            disablePadding
            sx={{ margin: '10px 0' }}
          >
            <ListItemButton role={undefined} dense>
              <ListItemText id={labelId} primary={value?.username} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
