import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/logoOnlyLayout";
import HomePage from "../pages";
import ClassesPage from "../pages/class";
import ExamPage from "../pages/exam";
import ExamPageUI from "../pages/exam/examPageUI";
import { ExamCreateUI } from "../pages/exam/examCreateUI";
import { EDIT_METHOD } from '../_enums/index';
import ExamTestPage from "../pages/examTest/examTestPage";
import { ExamTestCreate } from "../pages/examTest/examTestCreate";
import LecturesPage from "../pages/lecture";
import Login from "../pages/login"
import ReceiptsPage from "../pages/receipt";
import ReportsPage from "../pages/report";
import SessionsPage from "../pages/session";
import StudentsPage from "../pages/student";
import UserPage from "../pages/user";
import AccountManagerPage from "../pages/accountManager/AccountManagerPage";
import { AccountManagerCreate } from "../pages/accountManager/AccountManagerCreate";
import CoursesPage from "../pages/courses/CoursesPage";
import { CoursesCreate } from "../pages/courses/CoursesCreate";
import { ExamDetailPage } from "../pages/exam/examDetailPage";
import { ExamTestDetailPage } from "../pages/examTest/examTestDetail";
import { CourseDetailPage } from "../pages/courses/CourseDetailPage";
import BillPage from "../pages/bill/BillPage";
import { BillCreate } from "../pages/bill/BillCreate";
import RoomSchedulePage from "../pages/roomSchedule";

export default function RootRouter() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'home', element: <HomePage /> },

        { path: 'exam', element: <ExamPageUI /> },
        { path: 'exam/create', element: <ExamCreateUI method={EDIT_METHOD.create}/> },
        { path: 'exam/edit', element: <ExamCreateUI method={EDIT_METHOD.update}/> },
        { path: 'exam/detail', element: <ExamDetailPage /> },

        { path: 'session', element: <ExamTestPage /> },
        { path: 'session/create', element: <ExamTestCreate method={EDIT_METHOD.create} /> },
        { path: 'session/edit', element: <ExamTestCreate method={EDIT_METHOD.update} /> },
        { path: 'session/detail', element: <ExamTestDetailPage /> },

        { path: 'course', element: <CoursesPage /> },
        { path: 'course/create', element: <CoursesCreate method={EDIT_METHOD.create} /> },
        { path: 'course/edit', element: <CoursesCreate method={EDIT_METHOD.update} /> },
        { path: 'course/detail', element: <CourseDetailPage /> },

        { path: 'lecture', element: <LecturesPage /> },

        { path: 'schedule', element: <RoomSchedulePage /> },

        { path: 'account/manager', element: <AccountManagerPage /> },
        { path: 'account/manager/create', element: <AccountManagerCreate method={EDIT_METHOD.create} /> },
        { path: 'account/manager/edit', element: <AccountManagerCreate method={EDIT_METHOD.update} /> },

        { path: 'bill', element: <BillPage /> },
        { path: 'bill/create', element: <BillCreate /> },
        { path: 'report', element: <ReportsPage /> },
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
      path: "/test", element: <ExamPageUI />
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
