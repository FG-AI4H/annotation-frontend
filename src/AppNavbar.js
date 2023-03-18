import React, {useEffect} from 'react';
import {Auth} from "aws-amplify";
import {AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from "react-router-dom";

const AppNavBar = () => {

    const navigate = useNavigate();

    const [auth, setAuth] = React.useState(false);
    const [admin, setAdmin] = React.useState(false);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [username,setUsername] = React.useState(null);

    useEffect( () => {
            Auth.currentAuthenticatedUser({
                bypassCache: false
            }).then(data => {
                setAuth(true);
                setUsername(data.username);
                setAdmin(data.signInUserSession.accessToken.payload["cognito:groups"].some(g => (g === "ADMIN")));
            }, _error => {
                setAuth(false);
        })
        }
    );


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };


    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const signOut = () => {
        try {
            Auth.signOut().then( () => {
                setAuth(false);
                navigate('/');
            });
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    return (

            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={() => navigate('/')}
                    >
                        <MenuIcon />
                    </IconButton>

                    <img
                        alt=""
                        src="/AI4H_logo_blue_transparent.png"
                        height="30"
                        className="d-inline-block align-top"
                    />

                    {auth && (
                       <>
                    <Box sx={{ ml:'30px',flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

                        <Button
                            key='DataStore'
                            onClick={() => navigate('/datasets')}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            DataStore
                        </Button>
                        <Button
                            key='Annotation'
                            onClick={() => navigate('/annotation')}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Annotation
                        </Button>
                        <Button
                            key='Evaluation'
                            onClick={() => window.open('https://health.aiaudit.org/','_blank')}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Evaluation
                        </Button>

                        {admin ?
                            <Button
                                key='Admin'
                                onClick={() => navigate('/admin')}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Admin
                            </Button> : <React.Fragment />
                        }
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={username} src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
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
                            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                            <MenuItem onClick={signOut}>Sign-out</MenuItem>
                        </Menu>
                    </Box>
                       </>
                    )}
                </Toolbar>
            </AppBar>

    )
}
export default AppNavBar;
