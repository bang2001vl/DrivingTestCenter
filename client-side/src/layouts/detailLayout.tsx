import { Stack, styled, Tab } from "@mui/material";
import { FC } from "react";
import CustomizedTabs from "../components/tabs";

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(2),
    borderRadius: '10px',
    '&.Mui-selected': {
      color: '#fff',
      backgroundColor: "#00AB55",
      fontWeight: "bold"
    },

  }),
);

interface IProps{
  options: {label: string, onClick?: ()=>void}
}

export const DetailPageLayout : FC<IProps> = () =>{  
    return (
      <Stack>
      </Stack>
    );
  }