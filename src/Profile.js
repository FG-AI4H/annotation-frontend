import {Auth} from "aws-amplify";
import React, {Component} from 'react';
import AppNavbar from "./AppNavbar";
import * as Loader from "react-loader-spinner";
import {Container} from "@mui/material";


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentDidMount() {
        this.state = {isLoading: true};
        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(data => this.setState({isLoading: false,username: data.username, ...data.attributes,}))
            .catch(err => console.log(err));
    }

    render() {

        const {isLoading, username} = this.state;

        if (isLoading) {
            return (<div className="loading"><Loader.Puff
                color="#00a5e3"
                height={100}
                width={100}
                timeout={3000} //3 secs
            /></div>);
        }

        return (
            <div>
                <AppNavbar/>
                <Container className={'pt-5'}>

                </Container>
            </div>
        )
    }

}
export default Profile;
