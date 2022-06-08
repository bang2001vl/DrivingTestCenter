import PropTypes from 'prop-types';
// material
import { visuallyHidden } from '@mui/utils';
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// ----------------------------------------------------------------------

DataListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func
};

export default function DataListHead({
  headLabel,
}) {


  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell, index) => (
          <TableCell
            key={index}
            align={headCell.alignRight ? 'right' : 'left'}
          >
          
              {headCell.label}

          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
