import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Select,
  Stack,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
// component
import Iconify from '../../components/Iconify';
import { useState } from 'react';
import { string } from 'yup';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled<any>(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

export interface ISearchProperty {
  key: string,
  label: string,
}

interface IPropTypes {
  numSelected: number,

  searchValue: string,
  onSearchValueChanged: Function,

  searchProperties: ISearchProperty[],
  searchProperty: string,
  onSearchPropertyChanged: Function,
};

export default function DataListToolbar(props: IPropTypes) {
  return (
    <RootStyle
      sx={{
        ...(props.numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {props.numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {props.numSelected} selected
        </Typography>
      ) : (
        <Stack direction="row" alignItems="center" spacing={2}>
          <SearchStyle
            value={props.searchValue}
            onChange={props.onSearchValueChanged}

            placeholder="Search user..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
        </Stack>
      )}

      {props.numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" sx={undefined} />
          </IconButton>
        </Tooltip>
      ) : (
        <Stack direction="row" alignItems="center" spacing={2}>
          <FormControl variant="standard">
            <InputLabel id="select-search-property-label">Search by</InputLabel>
            <Select
              labelId="select-search-property-label"
              value={props.searchProperty}
              onChange={(event) => {
                if (typeof event.target.value === "string") {
                  props.onSearchPropertyChanged(event.target.value);
                }
              }}
            >
              {props.searchProperties.map((v, index) => {
                return <MenuItem
                  key={v.label}
                  value={v.key}
                >
                  {v.label}
                </MenuItem>
              })}
            </Select>
          </FormControl>
          <Tooltip title="Filter list">
            <IconButton>
              <Iconify icon="ic:round-filter-list" sx={undefined} />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </RootStyle>
  );
}
