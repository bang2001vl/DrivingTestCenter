import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/logoOnlyLayout";
import HomePage from "../pages";
import ClassesPage from "../pages/class";
import ExamPage from "../pages/exam";
import ExamPageUI from "../pages/exam/examPageUI";
import {ExamCreateUI} from "../pages/exam/examCreateUI";
import { EDIT_METHOD } from '../_enums/index';
import ExamTestPage from "../pages/examTest/examTestPage";
import {ExamTestCreate} from "../pages/examTest/examTestCreate";
import LecturesPage from "../pages/lecture";
import Login from "../pages/login"
import ReceiptsPage from "../pages/receipt";
import ReportsPage from "../pages/report";
import SessionsPage from "../pages/session";
import StudentsPage from "../pages/student";
import UserPage from "../pages/user";

export default function RootRouter() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'home', element: <HomePage /> },
        { path: 'exam', element: <ExamPageUI /> },
        { path: 'session', element: <ExamTestPage /> },
        { path: 'class', element: <ClassesPage /> },
        { path: 'lecture', element: <LecturesPage /> },
        { path: 'student', element: <StudentsPage /> },
        { path: 'receipt', element: <ReceiptsPage /> },
        { path: 'report', element: <ReportsPage /> },
        { path: 'exam/create', element: <ExamCreateUI method={EDIT_METHOD.create} />},
        { path: 'session/create', element: <ExamTestCreate method={EDIT_METHOD.create} />},

     
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
    {
      path: "/test", element: <ExamPageUI/>
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
