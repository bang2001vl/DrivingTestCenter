"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiServer = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const account_1 = require("./route/account");
const auth_1 = require("./route/auth");
const exam_1 = require("./route/exam");
const examTest_1 = require("./route/examTest/examTest");
const manager_1 = require("./route/account/manager");
const course_1 = require("./route/courses/course");
function ApiServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use("/public", (0, express_1.static)('public'));
    app.use("/auth", (0, auth_1.AuthRoute)());
    app.use("/account", (0, account_1.AccountRoute)());
    app.use("/exam", (0, exam_1.ExamRoute)());
    app.use("/examtest", (0, examTest_1.ExamTestRoute)());
    app.use("/user", (0, manager_1.AccountManagerRoute)());
    app.use("/course", (0, course_1.CourseRoute)());
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
}
exports.ApiServer = ApiServer;
;
