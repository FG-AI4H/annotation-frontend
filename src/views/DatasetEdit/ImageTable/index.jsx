import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';

export default function ImageTable({ images, onClickImage }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell align={'right'}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {images?.map((item) => {
            return (
              <TableRow
                key={item.photoKey}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap',
                    maxWidth: '600px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <Tooltip title={item.photoKey}>{item.photoKey}</Tooltip>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Stack
                    direction={'row'}
                    spacing={2}
                    justifyContent='flex-end'
                  >
                    <Button onClick={() => onClickImage(item)}>View</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
