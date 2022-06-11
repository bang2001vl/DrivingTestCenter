import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Typography, Stack } from '@mui/material';
import logo_manager from "../assets/images/logo_manager.png"

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <Stack alignContent='center' spacing={1} alignItems='center'>
      <RouterLink to="/">
        <Box component="img" src={logo_manager} sx={{ width: 50, height: 50, ...sx }} />
      </RouterLink >
      <Typography variant="h5" gutterBottom style={{ color: "#00AB55" }}>Mandrile</Typography>
    </Stack>
  );
}
