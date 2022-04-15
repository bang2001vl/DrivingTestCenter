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
    icon: getIconByURI('/static/icons/nav/exam.svg')
  },
  {
    title: 'session',
    path: '/dashboard/session',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'class',
    path: '/dashboard/class',
    icon: getIconByURI('/static/icons/nav/exam.svg')
  },
  {
    title: 'lecture',
    path: '/dashboard/lecture',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'student',
    path: '/dashboard/student',
    icon: getIconByURI('/static/icons/nav/student.svg')
  },
  {
    title: 'receipt',
    path: '/dashboard/receipt',
    icon: getIconByURI('/static/icons/nav/receipt.svg')
  },
  {
    title: 'report',
    path: '/dashboard/report',
    icon: getIconByURI('/static/icons/nav/report.svg')
  },
];

export default sidebarConfig;
