import LinearProgress from "@mui/material/LinearProgress";
import linearProgressClasses from "@mui/material/LinearProgress/linearProgressClasses";
import { styled } from "@mui/material/styles";


export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    width: '80%',
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));
