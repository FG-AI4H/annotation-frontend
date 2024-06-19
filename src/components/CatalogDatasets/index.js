import LinkIcon from '@mui/icons-material/Link';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Link,
  Modal,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import Alert from '@mui/material/Alert';
import DatasetClient from '../../api/DatasetClient';
import { initialDataset } from '../../views/DatasetEdit';
import DatasetForm from '../DatasetForm';

const modalMode = Object.freeze({ _EDIT: 'edit', _READ: 'read' });

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

//dataset metadata specification as per
// p.19: https://extranet.itu.int/sites/itu-t/focusgroups/ai4h/docs/FGAI4H-J-049.pdf
// and p. 4: https://extranet.itu.int/sites/itu-t/focusgroups/ai4h/_layouts/15/WopiFrame.aspx?sourcedoc=%7B3DAE32A1-24FF-4F4D-A735-F378056BA6CF%7D&file=FGAI4H-J-048.docx&action=default&CT=1610025396926&OR=DocLibClassicUI

export default function CatalogDatasets(props) {
  const [datasets, setDatasets] = useState(props.datasets);
  const [formState, setFormState] = useState(initialDataset);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [updated, setUpdated] = useState(false);
  const [updateType, setUpdateType] = useState('success');

  const [backdropOpen] = useState(false);

  useEffect(() => {
    setDatasets(props.datasets);
    setIsLoading(props.isLoading);
  }, [props.isLoading]);

  async function fetchTable(catalog_uuid, table_name) {
    const token = await Auth.currentAuthenticatedUser({ bypassCache: false });

    const client = new DatasetClient(
      token.signInUserSession.accessToken.jwtToken
    );
    const result = await client.fetchTableFromCatalog(catalog_uuid, table_name);
    return result.data;
  }

  async function viewDataset(index) {
    handleModalOpen(modalMode._READ, datasets[index]);
  }

  async function requestAccess(dataset) {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((currentUser) => {
        const client = new DatasetClient(
          currentUser.signInUserSession.accessToken.jwtToken
        );
        client.requestAccessToCatalogDataset(dataset).then((_response) => {
          setUpdated(true);
        });
      })
      .catch((err) => console.log(err));
  }

  //Open "Add / Edit Dataset" modal
  const handleModalOpen = (_mode, state) => {
    setOpen(true);
    setFormState(state);
  };

  //Close "Add / Edit Dataset" modal
  const handleModalClose = () => {
    setOpen(false);
  };

  function handleClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setUpdated(false);
  }

  return (
    <React.Fragment>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Snackbar
        open={updated}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert
          severity={updateType}
          sx={{ width: '100%' }}
          onClose={handleClose}
        >
          Request successfully sent to owner!
        </Alert>
      </Snackbar>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell width='5%'></TableCell>
              <TableCell width='30%'>Data Source</TableCell>
              <TableCell width='20%'>Owner</TableCell>
              <TableCell width='20%'>Location</TableCell>
              <TableCell width='10%' align={'right'}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets?.map((dataset, index) => (
              <TableRow key={dataset.id}>
                <TableCell>
                  <LinkIcon />
                </TableCell>
                <TableCell>
                  <Link href='#' onClick={() => viewDataset(index)}>
                    {dataset.name}
                  </Link>
                </TableCell>
                <TableCell>{dataset.metadata.data_owner_name}</TableCell>
                <TableCell>{dataset.catalog_location}</TableCell>
                <TableCell>
                  <Stack
                    direction={'row'}
                    spacing={2}
                    justifyContent='flex-end'
                  >
                    <Button
                      size='small'
                      color='info'
                      onClick={() => requestAccess(dataset)}
                    >
                      Request Access
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            View Dataset
          </Typography>

          <DatasetForm readOnlyMode={true} formState={formState} />

          <Stack direction='row' spacing={2} sx={{ mt: 5 }}>
            <Button variant='contained' onClick={handleModalClose}>
              Close
            </Button>
          </Stack>

          <Backdrop open={backdropOpen}>
            <CircularProgress color='inherit' />
          </Backdrop>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
