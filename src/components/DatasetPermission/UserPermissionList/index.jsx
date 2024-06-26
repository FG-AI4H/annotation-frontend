import {
  Checkbox,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
} from "@mui/material";
import { useState } from "react";

const PERMISSIONS = [
  {
    label: "Reader",
    value: "READER",
  },
  {
    label: "Contributor",
    value: "CONTRIBUTOR",
  },
];

export default function UserPermissionList({ users = [], onChange }) {
  const [checked, setChecked] = useState([]);

  const handleToggle = (record) => {
    const currentIndex = checked.findIndex((item) => item?.id === record?.id);

    const newChecked = [...checked];
    if (currentIndex === -1) {
      const newRecord = { ...record, user_role: "READER" };
      newChecked.push(newRecord);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    onChange(newChecked);
    setChecked(newChecked);
  };

  const handleSelect = (e, id) => {
    const foundIdx = checked?.findIndex((item) => item?.id === id);
    const newChecked = [...checked];

    if (foundIdx === -1) return;
    newChecked[foundIdx].user_role = e?.target?.value;

    onChange(newChecked);
    setChecked(newChecked);
  };

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: "100%",
        maxHeight: 400,
        overflow: "auto",
        bgcolor: "background.paper",
        background: users?.length ? "#1f1f1f" : "unset",
      }}
    >
      {users?.map((value) => {
        const labelId = value?.id;

        return (
          <ListItem
            key={value?.id}
            secondaryAction={
              <FormControl fullWidth>
                <InputLabel htmlFor="select-role">Role</InputLabel>
                <Select
                  value={null}
                  defaultValue={"READER"}
                  label="Role"
                  disabled={
                    checked.findIndex((item) => item?.id === value?.id) === -1
                  }
                  onChange={(e) => {
                    handleSelect(e, value?.id);
                  }}
                  placeholder={"Role"}
                  native
                  sx={{ height: "40px" }}
                >
                  {PERMISSIONS.map((item, index) => (
                    <option key={index} value={item?.value}>
                      {item?.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            }
            disablePadding
            sx={{ margin: "10px 0" }}
          >
            <ListItemButton
              role={undefined}
              onClick={() => handleToggle(value)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={
                    checked.findIndex((item) => item?.id === value?.id) !== -1
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value?.username} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
