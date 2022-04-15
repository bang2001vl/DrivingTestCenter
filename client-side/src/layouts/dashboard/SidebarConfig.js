// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

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
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'session',
    path: '/dashboard/session',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'class',
    path: '/dashboard/class',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'lecture',
    path: '/dashboard/lecture',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'student',
    path: '/dashboard/student',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'receipt',
    path: '/dashboard/receipt',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'report',
    path: '/dashboard/report',
    icon: getIcon('eva:shopping-bag-fill')
  },
];

export default sidebarConfig;
