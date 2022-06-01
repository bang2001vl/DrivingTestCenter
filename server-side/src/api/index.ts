import cors from "cors";
import express, { NextFunction, static as expressStatic } from "express";
import appConfig from "../config";
import helper from "../helper";
import { AccountRoute } from "./route/account";
import { AuthRoute } from "./route/auth";
import { ExamRoute } from "./route/exam";
import { ExamTestRoute } from "./route/examTest";
import { UserRoute } from "./route/user";

export function ApiServer() {
    const app = express();
    app.use(cors());

    app.use("/public", expressStatic('public'));

    app.use("/auth", AuthRoute());
    app.use("/account", AccountRoute());

    app.use("/exam", ExamRoute());
    app.use("/examtest", ExamTestRoute());
    app.use("/user", UserRoute());

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