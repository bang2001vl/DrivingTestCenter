// component
import { Box } from '@mui/material';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIconByURI = (uri) => <Box component="img" src={uri} width={22} height={22} />;
const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/home',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'exam',
    path: '/dashboard/exam',
    icon: getIcon('ph:exam-fill')
  },
  {
    title: 'session',
    path: '/dashboard/session',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'class',
    path: '/dashboard/class',
    icon: getIcon('eos-icons:storage-class')
  },
  {
    title: 'lecture',
    path: '/dashboard/lecture',
    icon: getIcon('fa-solid:chalkboard-teacher')
  },
  {
    title: 'Tài khoản',
    path: '/dashboard/account/manager',
    icon: getIcon('bxs:user-account')
  },
  {
    title: 'receipt',
    path: '/dashboard/receipt',
    icon: getIcon('bxs:receipt')
  },
  {
    title: 'report',
    path: '/dashboard/report',
    icon: getIcon('heroicons-solid:document-report')
  },
];

export default sidebarConfig;
