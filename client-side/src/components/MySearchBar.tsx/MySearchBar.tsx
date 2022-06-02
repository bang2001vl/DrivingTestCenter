import { alpha, Button, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField, Theme, Toolbar, Tooltip, Typography } from "@mui/material";
import { styled, makeStyles } from "@mui/styles";
import { CSSProperties, FC, useEffect, useState } from "react";
import palette from "../../theme/palette";
import { customShadows } from "../../theme/shadows";
import { CommonButton } from "../Buttons/common";
import Iconify from "../Iconify";
import './MySearchBar.css';

const RootStyle: CSSProperties = {
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
};

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    width: 320,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': { width: 320, boxShadow: customShadows.z8 },
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${palette.grey[500_32]} !important`
    }
  },
  buttonSubmit: {
    boxShadow: theme.shadows[0],
    transition: theme.transitions.create(['box-shadow'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&:hover': {
      boxShadow: customShadows.z8,
    },
  }
}));

interface ISelectable<T = any> {
  label: string,
  value: T
}

interface IProps {
  hintText?: string;

  searchOptionList: ISelectable[]
  selectedSearchOption?: ISelectable

  orderOptionList: ISelectable[]
  selectedOrderOption?: ISelectable

  onSubmit?: (data: any) => void,
}

export const MySearchBar: FC<IProps> = (props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchOption, setSearchOption] = useState<any>(props.searchOptionList[0].value);
  const [orderOption, setOrderOption] = useState<any>(props.orderOptionList[0].value);

  const classes = useStyles();

  function getData() {
    return {
      searchvalue: searchValue,
      searchby: searchOption.searchby,
      orderby: orderOption.orderby,
      orderdirection: orderOption.orderdirection,
    }
  }

  return <Toolbar style={RootStyle}>
    <Stack direction="row" alignItems="center" spacing={2}>

      <OutlinedInput className={classes.searchBar}
        value={searchValue}
        onChange={(ev) => setSearchValue(ev.currentTarget.value)}

        placeholder={props.hintText ? props.hintText : "Type search content here"}
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />

      <CommonButton
        onClick={(ev) => {
          if (props.onSubmit) {
            props.onSubmit(getData());
          }
        }}
        >Search</CommonButton>

    </Stack>

    <Stack direction={"row"} alignItems="center" spacing={2}>
      <FormControl>
        <TextField
          label="Search by"
          value={searchOption ? searchOption : props.searchOptionList[0].value}
          onChange={(event) => setSearchOption(event.target.value)}
          select
        >
          {props.searchOptionList.map((v, index) => {
            return <MenuItem
              key={index}
              value={v.value}
            >
              {v.label}
            </MenuItem>
          })}
        </TextField>
      </FormControl>

      <FormControl>
        <TextField
          label="Order By"
          value={orderOption ? orderOption : props.orderOptionList[0].value}
          onChange={(event) => setOrderOption(event.target.value)}
          select
        >
          {props.orderOptionList.map((v, index) => {
            return <MenuItem
              key={index}
              value={v.value}
            >
              {v.label}
            </MenuItem>
          })}
        </TextField>
      </FormControl>
    </Stack>
  </Toolbar>;
}