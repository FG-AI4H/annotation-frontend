import { Backdrop, CircularProgress, Container } from "@mui/material";
import { Auth } from "aws-amplify";
import React, { Component } from "react";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((data) =>
        this.setState({
          isLoading: false,
          username: data.username,
          ...data.attributes,
        })
      )
      .catch((err) => console.log(err));
  }

  render() {
    const { isLoading, username } = this.state;

    return (
      <div>
        <Backdrop
          open={isLoading}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Container className={"pt-5"}></Container>
      </div>
    );
  }
}
export default Profile;
