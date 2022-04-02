import React, {Component} from 'react';
import {Auth} from "aws-amplify";
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';


export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(data => this.setState({ username: data.username, ...data.attributes, }))
            .catch(err => console.log(err));
    }

    async signOut() {
        try {
            await Auth.signOut();
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    render() {

        const {username, isLoading} = this.state;

        return <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        FG-AI4H Platform
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>


    }
}
