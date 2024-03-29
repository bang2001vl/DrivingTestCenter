import cors from "cors";
import express, { NextFunction, static as expressStatic } from "express";
import appConfig from "../config";
import helper from "../helper";
import { AccountRoute } from "./route/account";
import { AuthRoute } from "./route/auth";
import { ExamRoute } from "./route/exam";
import { ExamTestRoute } from "./route/examTest/examTest";
import { AccountManagerRoute } from "./route/account/manager";
import { CourseRoute } from "./route/courses/course";
import { StudentRoute } from "./route/student";
import { CNNRoute } from "./route/cnn";
import { BillRoute } from "./route/bill";
import { StatisticRoute } from "./route/statistic";
import { ScheduleRoute } from "./route/schedule";
import { ClassScheduleRoute } from "./route/classSchedule";

export function ApiServer() {
    const app = express();
    app.use(cors());

    app.use("/public", expressStatic('public'));

    app.use("/auth", AuthRoute());
    app.use("/account", AccountRoute());

    app.use("/exam", ExamRoute());
    app.use("/examtest", ExamTestRoute());
    app.use("/user", AccountManagerRoute());
    
    app.use("/course", CourseRoute());
    app.use("/student", StudentRoute());
    app.use("/cnn", CNNRoute());
    app.use("/bill", BillRoute());
    app.use("/statistic", StatisticRoute());
    app.use("/classSchedule", ClassScheduleRoute())
    app.use("/schedule", ScheduleRoute());

    app.use((req, res, next) => {
        if (res.locals.error) {
            res.json(res.locals.error);
        }
        else if (res.locals.responseData) {
            res.json(res.locals.responseData);
        }
        else {
            //res.status(404).send();
        }
    });
    return app;
};