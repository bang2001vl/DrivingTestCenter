import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/logoOnlyLayout";
import HomePage from "../pages";
import ExamPage from "../pages/exam";
import Login from "../pages/login"
import UserPage from "../pages/user";

export default function RootRouter() {
    return useRoutes([
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { path: 'home', element: <HomePage /> },
          { path: 'user', element: <UserPage /> },
          { path: 'exam', element: <ExamPage /> },
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
  