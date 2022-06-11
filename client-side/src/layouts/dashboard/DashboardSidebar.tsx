import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack, Card } from '@mui/material';
// mocks_
import account from '../../_mocks_/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import sidebarConfig from './SidebarConfig';
import { useRecoilValue } from 'recoil';
import { AccountSingleton } from '../../singleton/account';
import { createBEPublicURI } from '../../_helper/helper';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled<any>('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12]
}));

// ----------------------------------------------------------------------

interface IProps {
  isOpenSidebar: boolean,
  onCloseSidebar: any
}

DashboardSidebar.propTypes = {
};

export default function DashboardSidebar(props: IProps) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');
  const navigate = useNavigate();

  const userInfo = AccountSingleton.instance.userInfo;
  const session = AccountSingleton.instance.session;
  const userFullname = userInfo ? userInfo.fullname : "Login";
  const userSecondText = session ? getRole(session.roleId).text : "";
  const userImageURI = userInfo && userInfo.avatarURI ? createBEPublicURI(userInfo.avatarURI) : '/static/mock-images/avatars/avatar_default.jpg';


  useEffect(() => {
    if (props.isOpenSidebar) {
      props.onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  function getRole(role:number) {
    if (role === 0) {
        return {
            text: "Admin",
            color: "success"
        };
    } else if (role === 1) {
        return {
            text: "Học viên",
            color: "secondary"
        };
    } else {
        return {
            text: "Giảng viên",
            color: "warning"
        };
    }
}
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }} alignSelf='center'>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }} >
        <div onClick={AccountSingleton.instance.isLogined ? undefined : () => navigate("/login", { replace: true })} >
          <AccountStyle>
            <Avatar src={userImageURI} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {userFullname}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {userSecondText}
              </Typography>
            </Box>
          </AccountStyle>
        </div>

      </Box>

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        {/* <Stack
          alignItems="center"
          spacing={3}
          sx={{ pt: 5, borderRadius: 2, position: 'relative' }}
        >
          <Box
            component="img"
            src="/static/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box>

          <Button
            href="https://material-ui.com/store/items/minimal-dashboard/"
            target="_blank"
            variant="contained"
          >
            Upgrade to Pro
          </Button>
        </Stack> */}
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={props.isOpenSidebar}
          onClose={props.onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed'
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
