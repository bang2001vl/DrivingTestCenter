"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const account_1 = __importDefault(require("./route/account"));
const exam_1 = require("./route/exam");
const login_1 = __importDefault(require("./route/login"));
const APIServer = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use("/account", (0, account_1.default)());
    app.use("/login", (0, login_1.default)());
    app.use("/exam", (0, exam_1.ExamRouter)());
    return app;
};
exports.default = APIServer;
