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
    title: 'Kì thi',
    path: '/dashboard/exam',
    icon: getIcon('ph:exam-fill')
  },
  {
    title: 'Ca thi',
    path: '/dashboard/session',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'Khóa học',
    path: '/dashboard/course',
    icon: getIcon('eos-icons:storage-class')
  },
  {
    title: 'Tài khoản',
    path: '/dashboard/account/manager',
    icon: getIcon('bxs:user-account')
  },
  {
    title: 'Hóa đơn',
    path: '/dashboard/bill',
    icon: getIcon('bxs:receipt')
  },
  {
    title: 'Báo cáo',
    path: '/dashboard/report',
    icon: getIcon('heroicons-solid:document-report')
  },
];

export default sidebarConfig;
