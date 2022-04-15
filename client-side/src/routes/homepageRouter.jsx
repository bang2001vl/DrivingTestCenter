import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/logoOnlyLayout";
import HomePage from "../pages";
import ExamPage from "../pages/exam";
import ExamCreate, { EDIT_METHOD } from "../pages/examCreate";
import Login from "../pages/login"
import UserPage from "../pages/user";

export default function RootRouter() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'home', element: <HomePage /> },
        { path: 'exam', element: <ExamPage /> },
        { path: 'exam/create', element: <ExamCreate method={EDIT_METHOD.create}/> },
        { path: 'exam/update', element: <ExamCreate method={EDIT_METHOD.update}/> },
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/home" /> },
        { path: 'login', element: <Login /> },
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
