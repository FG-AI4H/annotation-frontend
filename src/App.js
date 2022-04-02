import './App.css';
import React from 'react';
import {withAuthenticator} from '@aws-amplify/ui-react';

import Home from './Home';
import DataStoreHome from './DataStoreHome';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import TaskList from './TaskList';
import TaskEdit from "./TaskEdit";
import CampaignList from './CampaignList';
import CampaignEdit from "./CampaignEdit";
import AnnotationHome from "./AnnotationHome";
import Profile from "./Profile";
import AdminHome from "./AdminHome";
import UserManagement from "./UserManagement";
import UserEdit from "./UserEdit";
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {grey} from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(255, 255, 255, 0.87)'
    },
    text: {
      primary: '#fff',
      secondary: grey[500],
    },
  }
});


class App extends React.Component {

  render() {
    return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>

            <Routes>
              <Route path='/' exact={true} element={<Home/>}/>
              <Route path='/dashboard' exact={true} element={<DataStoreHome/>}/>

              <Route path='/annotation' exact={true} element={<AnnotationHome/>}/>
              <Route path='/tasks' exact={true} element={<TaskList/>}/>
              <Route path='/myTasks' exact={true} render={(props) => (
                  <TaskList {...props} me={true} />
              )}/>
              <Route path='/tasks/:id' element={<TaskEdit/>}/>
              <Route path='/campaigns' exact={true} element={<CampaignList/>}/>
              <Route path='/campaigns/:id' element={<CampaignEdit/>}/>
              <Route path='/benchmark' element={() => {
                window.location.href = 'https://health.aiaudit.org/';
                return null;
              }}/>
              <Route
                  exact
                  path="/profile"
                  element={Profile}
              />
              <Route path='/admin' exact={true} element={<AdminHome/>}/>
              <Route path='/userManagement' exact={true} element={<UserManagement/>}/>
              <Route path='/users/:id' element={<UserEdit/>}/>
            </Routes>

          </Router>
        </ThemeProvider>
    );
  }
}

export default withAuthenticator(App);
