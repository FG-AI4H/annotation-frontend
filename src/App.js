import { withAuthenticator } from '@aws-amplify/ui-react';
import React from 'react';
import './App.css';

import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import {
  AnnotationHome,
  AnnotationToolEdit,
  CampaignEdit,
  CampaignList,
  CatalogEdit,
  CatalogManagement,
  DataStoreHome,
  DatasetEdit,
  Home,
  Profile,
  TaskEdit,
  TaskList,
  ToolManagement,
  UserEdit,
  UserManagement,
} from './views';
import AdminHome from './views/AdminHome';
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(255, 255, 255, 0.87)',
    },
    text: {
      primary: '#fff',
      secondary: grey[500],
    },
  },
});

function App({ signOut, user }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <Routes>
          <Route path='/' exact={true} element={<Layout />}>
            <Route path='/' exact={true} element={<Home />} />
            <Route path='/datasets' exact={true} element={<DataStoreHome />} />
            <Route
              path='/datasets/:id'
              exact={true}
              element={<DatasetEdit />}
            />

            <Route
              path='/annotation'
              exact={true}
              element={<AnnotationHome />}
            />
            <Route path='/tasks' exact={true} element={<TaskList />} />
            <Route
              path='/myTasks'
              exact={true}
              element={<TaskList me={true} />}
            />
            <Route path='/tasks/:id' element={<TaskEdit />} />
            <Route path='/campaigns' exact={true} element={<CampaignList />} />
            <Route path='/campaigns/:id' element={<CampaignEdit />} />
            <Route
              path='/annotationTools'
              exact={true}
              element={<ToolManagement />}
            />
            <Route
              path='/annotationTools/:id'
              element={<AnnotationToolEdit />}
            />
            <Route
              path='/dataCatalogs'
              exact={true}
              element={<CatalogManagement />}
            />
            <Route
              path='/dataCatalogs/:id'
              exact={true}
              element={<CatalogEdit />}
            />
            <Route
              path='/benchmark'
              element={() => {
                window.location.href = 'https://health.aiaudit.org/';
                return null;
              }}
            />
            <Route exact path='/profile' element={Profile} />
            <Route path='/admin' exact={true} element={<AdminHome />} />
            <Route
              path='/userManagement'
              exact={true}
              element={<UserManagement />}
            />
            <Route path='/users/:id' element={<UserEdit />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default withAuthenticator(App);
