import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip
} from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppNavBar = () => {
  const navigate = useNavigate();

  const [auth, setAuth] = React.useState(false);
  const [admin, setAdmin] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    }).then(
      (data) => {
        setAuth(true);
        setUsername(data.username);
        setAdmin(
          data.signInUserSession.accessToken.payload['cognito:groups']?.some(
            (g) => g === 'ADMIN'
          )
        );
      },
      (_error) => {
        setAuth(false);
      }
    );
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signOut = () => {
    try {
      Auth.signOut().then(() => {
        setAuth(false);
        navigate('/');
      });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  const MENU = [
    {
      label: 'DATASTORE',
      route: '/datasets',
      admin: false,
      openOutSide: false,
    },
    {
      label: 'ANNOTATION',
      route: '/annotation',
      admin: false,
      openOutSide: false,
    },
    {
      label: 'EVALUATION',
      route: 'https://health.aiaudit.org/',
      admin: false,
      openOutSide: true,
    },
    {
      label: 'Admin',
      route: '/admin',
      admin: true,
      openOutSide: false,
    },
  ];

  const MAPPED_MENU = () => {
    return MENU.map((item, idx) => {
      if (item.admin) {
        return admin ? (
          <Button
            key={idx}
            onClick={() => {
              if (item.openOutSide) {
                window.open(item.route, '_blank');
              } else {
                navigate(item.route);
              }
            }}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            {item.label}
          </Button>
        ) : null;
      }

      return (
        <Button
          key={idx}
          onClick={() => {
            if (item.openOutSide) {
              window.open(item.route, '_blank');
            } else {
              navigate(item.route);
            }
          }}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          {item.label}
        </Button>
      );
    });
  };

  return (
    <AppBar position='static'>
      <Toolbar sx={{ justifyContent: { xs: 'space-between' } }}>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='open drawer'
          sx={{ mr: 2 }}
          onClick={() => setOpenDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <img
          alt=''
          src='/AI4H_logo_blue_transparent.png'
          height='30'
          className='d-inline-block align-top'
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />

        {auth && (
          <>
            <Box
              sx={{
                ml: '30px',
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {MAPPED_MENU()}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={username} src='/static/images/avatar/2.jpg' />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
                <MenuItem onClick={signOut}>Sign-out</MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>

      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '10px 0',
          }}
          onClick={() => {
            navigate('/');
            setOpenDrawer(false);
          }}
        >
          <img
            alt=''
            src='/AI4H_logo_blue_transparent.png'
            height='30'
            className='d-inline-block align-top'
            style={{ cursor: 'pointer', width: 'fit-content' }}
          />
        </div>
        <List>
          {MENU.map((item) => {
            if (item.admin) {
              return admin ? (
                <ListItemButton
                  key={item.label}
                  sx={{ width: '200px' }}
                  onClick={() => {
                    if (item.openOutSide) {
                      window.open(item.route, '_blank');
                    } else {
                      navigate(item.route);
                    }
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ) : null;
            }

            return (
              <ListItemButton
                key={item.label}
                sx={{ width: '200px' }}
                onClick={() => {
                  if (item.openOutSide) {
                    window.open(item.route, '_blank');
                  } else {
                    navigate(item.route);
                  }
                  setOpenDrawer(false);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </AppBar>
  );
};
export default AppNavBar;
