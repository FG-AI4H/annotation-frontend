import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export default function DataTable({
  columns,
  data,
  stickyHeader = false,
  maxHeight = '100%',
}) {
  return (
    <TableContainer component={Paper} sx={{ overflow: 'auto', maxHeight }}>
      <Table
        sx={{ width: '100%', height: '100%' }}
        aria-label='simple table'
        stickyHeader={stickyHeader}
      >
        <TableHead>
          <TableRow>
            {columns?.map(({ fieldName, config }) => {
              return <TableCell {...config}>{fieldName}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow
              key={row?.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {columns.map(({ id, renderCell }) => {
                return renderCell ? (
                  renderCell(row)
                ) : (
                  <TableCell component='th' scope='row'>
                    {row?.[id]}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
