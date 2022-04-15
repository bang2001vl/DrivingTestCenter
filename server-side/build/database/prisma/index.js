"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repo = exports.myPrisma = void 0;
const client_1 = require("@prisma/client");
const account_1 = require("./repository/account");
const session_1 = require("./repository/session");
const student_1 = __importDefault(require("./repository/student"));
exports.myPrisma = new client_1.PrismaClient();
exports.repo = {
    account: new account_1.AccountRepository(exports.myPrisma.account),
    session: new session_1.SessionRepository(exports.myPrisma.session),
    student: new student_1.default(exports.myPrisma.student),
};
