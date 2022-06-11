// component
import { Box } from '@mui/material';
import Iconify from '../../components/Iconify';
import { AccountSingleton } from '../../singleton/account';

// ----------------------------------------------------------------------

const getIconByURI = (uri) => <Box component="img" src={uri} width={22} height={22} />;
const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;
const currentUser = AccountSingleton.instance.userInfo;
let sidebarConfig = new Array();

{
  sidebarConfig.push(
    {
      title: 'Kì thi',
      path: '/dashboard/exam',
      icon: getIcon('ph:exam-fill')
    }
  )
  sidebarConfig.push(
    {
      title: 'Ca thi',
      path: '/dashboard/session',
      icon: getIcon('eva:shopping-bag-fill')
    })
  sidebarConfig.push(
    {
      title: 'Lớp học',
      path: '/dashboard/course',
      icon: getIcon('dashicons:welcome-learn-more')
    })
  sidebarConfig.push(
    {
      title: 'Lịch phòng',
      path: '/dashboard/schedule',
      icon: getIcon('eos-icons:storage-class')
    });
}
if (currentUser) {
  const session = AccountSingleton.instance.session;
  const userRole = session.roleId;
  if (userRole === 0) {
    sidebarConfig.unshift({
      title: 'Tổng quan',
      path: '/dashboard/home',
      icon: getIcon('eva:pie-chart-2-fill')
    })

    sidebarConfig.push({
      title: 'Tài khoản',
      path: '/dashboard/account/manager',
      icon: getIcon('bxs:user-account')
    });
    sidebarConfig.push({
      title: 'Hóa đơn',
      path: '/dashboard/bill',
      icon: getIcon('bxs:receipt')
    });
  }
}





// {
//   title: 'Báo cáo',
//   path: '/dashboard/report',
//   icon: getIcon('heroicons-solid:document-report')
// },
export default sidebarConfig;
