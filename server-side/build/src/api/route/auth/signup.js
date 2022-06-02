"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupRoute = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../../config"));
const helper_1 = __importDefault(require("../../../helper"));
const utilities_1 = require("../utilities");
const _wrapper_1 = require("../_wrapper");
const nodemailer_1 = require("../../../nodemailer");
const prisma_1 = require("../../../prisma");
const secretJWT = "asdjb!@#!523BD#@$";
const optionJWT = {
    issuer: "n2tb",
    audience: "thunder-server-2",
};
const PATH_SUCCESS_HTML = path_1.default.resolve(config_1.default.resourceFolder, "template/success.html");
const tag = "SignUp";
const SignupRoute = () => {
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    route.use((0, express_1.urlencoded)({ extended: true }));
    route.post("/", _wrapper_1.RouteHandleWrapper.wrapCheckInput(parseInput, tag), _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const account = res.locals.input.data;
        //console.log("Locals = " + JSON.stringify(res.locals, null, 2));
        // Check duplicate username
        const oldAccount = yield prisma_1.myPrisma.account.findFirst({
            where: { username: account.username }
        });
        if (oldAccount) {
            throw (0, utilities_1.buildResponseError)(2, "Username already registered");
        }
        // Create token
        const token = (0, jsonwebtoken_1.sign)({
            account: account
        }, secretJWT, Object.assign(Object.assign({}, optionJWT), { expiresIn: 2 * 60 * 60 }));
        helper_1.default.logger.traceWithTag(tag, "Token: " + token);
        // Send verify email
        const email = account.email;
        yield (0, nodemailer_1.sendConfirmEmail)(email, token);
        res.locals.responseData = (0, utilities_1.buildResponseSuccess)({
            message: "Please check your email to verify your account",
        });
    }), tag, true));
    route.get("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        helper_1.default.logger.traceWithTag(tag, "Got request");
        const token = req.query.token;
        if (typeof token === "string") {
            try {
                const decoded = (0, jsonwebtoken_1.verify)(token, secretJWT, optionJWT);
                if (decoded
                    && typeof decoded !== "string"
                    && decoded.account
                    && typeof decoded.account.username === "string"
                    && typeof decoded.account.password === "string") {
                    helper_1.default.logger.traceWithTag(tag, "Decoded: " + JSON.stringify(decoded, null, 2));
                    // Check duplicate username
                    const oldAccount = yield prisma_1.myPrisma.account.findFirst({
                        where: { username: decoded.account.username }
                    });
                    if (oldAccount) {
                        res.send("Account already verified");
                        return;
                    }
                    // Create record
                    const result = yield prisma_1.myPrisma.account.create({
                        data: Object.assign(Object.assign({}, decoded.account), { status: 1 }),
                    });
                    helper_1.default.logger.traceWithTag(tag, "Signup sucessfull with account" + JSON.stringify(decoded.account, null, 2));
                    return res.sendFile(PATH_SUCCESS_HTML);
                }
            }
            catch (ex) {
                res.status(404).send("Invalid token");
                return;
            }
        }
        helper_1.default.logger.traceWithTag(tag, "Invalid query: " + req.query);
        res.status(404);
    }));
    route.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.sendFile(PATH_SUCCESS_HTML);
    }));
    return route;
};
exports.SignupRoute = SignupRoute;
function parseInput(input) {
    if (input) {
        const inputAccount = parsedAccount(input.account);
        const inputUserInfo = parsedUserInfo(input.userInfo);
        if (inputAccount && inputUserInfo) {
            return {
                data: Object.assign(Object.assign({}, inputAccount), inputUserInfo)
            };
        }
    }
}
function parsedAccount(account) {
    if (account
        && typeof (account.username) === "string"
        && typeof (account.password) === "string") {
        return {
            username: account.username,
            password: account.password,
        };
    }
}
function parsedUserInfo(userInfo) {
    if (userInfo
        && typeof (userInfo.fullname) === "string"
        && typeof (userInfo.email) === "string"
        && typeof (userInfo.address) === "string"
        && !isNaN(userInfo.gender)
        && new Date(userInfo.birthday)) {
        return {
            fullname: userInfo.fullname,
            email: userInfo.email,
            address: userInfo.address,
            gender: parseInt(userInfo.gender),
            birthday: userInfo.birthday,
        };
    }
}
/// After 5 hours, delete accounts which not verified before 5 hours ago
/// Means: Account which not verified will be delete between 5-10 hours
// setInterval(() => {
//     const min = dayjs().subtract(1, "minute").toISOString();
//     cleanAccount(min);
// }, 1 * 60 * 1000);
// async function cleanAccount(minCreateAt: Date | string) {
//     const result = await myPrisma.account.deleteMany({
//         where: {
//             AND: [
//                 {
//                     status: 0
//                 },
//                 {
//                     createdAt: {
//                         lte: minCreateAt
//                     }
//                 },
//             ]
//         }
//     });
//     return result;
// }
