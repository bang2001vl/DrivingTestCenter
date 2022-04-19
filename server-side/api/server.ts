import cors from "cors";
import express from "express";
import AccountRouter from "./route/account";
import { ExamRouter } from "./route/exam";
import LoginRouter from "./route/login";

const APIServer = ()=>{
    const app = express();

    app.use(cors());
    
    app.use("/account", AccountRouter());
    app.use("/login", LoginRouter());
    app.use("/exam", ExamRouter());

    app.use((req,res)=>{
        console.log("Default hanle response with data: " + JSON.stringify(res.locals.responseData, null, 4));
        res.json(res.locals.responseData)
    });
    return app;
}

export default APIServer;