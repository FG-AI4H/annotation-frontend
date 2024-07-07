import {
  Box,
  Button,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const initialItem = {
  title: '',
  itemUrl: '',
  photoData: undefined,
};

const DatasetItemModal = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby='simple-modal-title'
      aria-describedby='simple-modal-description'
    >
      <Box sx={style}>
        <Grid
          container
          spacing={2}
          sx={{
            width: undefined,
            height: 'calc(100% - 50px)',
          }}
        >
          <Grid item xs={4}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Attributes
            </Typography>
            <form noValidate autoComplete='off'>
              <TextField
                fullWidth
                margin={'normal'}
                label='Name'
                required
                value={props.item.photoKey}
              />
            </form>
          </Grid>
          <Grid item xs={8}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center'
              component='img'
              sx={{
                width: '100%',
                aspectRatio: 'auto',
                height: '100%',
                maxWidth: '100%',
                mr: 'auto',
                ml: 'auto',
              }}
              src={`data:image/png;base64,${props.item.photoData}`}
              srcSet={`data:image/png;base64,${props.item.photoData}`}
              alt={props.item.title}
            />
          </Grid>
        </Grid>

        <Stack direction='row' spacing={2} sx={{ mt: 5 }}>
          <Button variant='contained' onClick={() => props.handleClose()}>
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
export default DatasetItemModal;
