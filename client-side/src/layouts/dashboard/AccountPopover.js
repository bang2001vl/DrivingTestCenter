import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import MenuPopover from '../../components/MenuPopover';
//
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../recoil/model/user';
import { differenceInCalendarYears } from 'date-fns';
import { authAtom, roleSelector } from '../../recoil/model/auth';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/'
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '#'
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '#'
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const currentUser = useRecoilValue(userAtom);
  const currentRole = useRecoilValue(roleSelector);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  console.log("Current user: ");
  console.log(currentUser);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const gotoLogin = () => {
    navigate("/login", { replace: true });
  };

  const userFullname = currentUser ? currentUser.fullname : "Chưa đăng nhập";
  const userSecondText = currentRole;
  const userImageURI = currentUser ? currentUser.imageURI : '/static/mock-images/avatars/avatar_default.jpg';

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={userImageURI} alt="photoURL" />
      </IconButton>

      {buildItem()}

    </>
  );

  function buildItem(){
    if(currentUser){
      return (<MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap >
            {userFullname}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userSecondText}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Iconify
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined">
            Logout
          </Button>
        </Box>
      </MenuPopover>)
    }
    else {
      return (
        <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
      <Box sx={{ p: 2, pt: 1.5 }}>
        <Button fullWidth color="inherit" variant="outlined" href='/signup'>
          Signup
        </Button>
      </Box>
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" href='/login'>
            Login/Signup
          </Button>
        </Box>
      </MenuPopover>
      )
    }
  }
}
