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
exports.AuthRoute = void 0;
const crypto_1 = require("crypto");
const express_1 = require("express");
const helper_1 = __importDefault(require("../../../helper"));
const nodemailer_1 = require("../../../nodemailer");
const prisma_1 = require("../../../prisma");
const session_1 = __importDefault(require("../../handler/session"));
const utilities_1 = require("../utilities");
const _wrapper_1 = require("../_wrapper");
const session_2 = require("./session");
const signup_1 = require("./signup");
const tag = "Auth";
const AuthRoute = () => {
    const route = (0, express_1.Router)();
    route.use("/signup", (0, signup_1.SignupRoute)());
    route.use("/session", (0, session_2.SessionRoute)());
    route.use((0, express_1.json)());
    route.post("/login", _wrapper_1.RouteHandleWrapper.wrapCheckInput(input => {
        helper_1.default.logger.traceWithTag(tag, "Has input " + JSON.stringify(input, null, 2));
        if (input
            && typeof input.username === "string"
            && typeof input.password === "string"
            && typeof input.deviceInfo === "string") {
            return {
                username: String(input.username),
                password: String(input.password),
                deviceInfo: String(input.deviceInfo),
            };
        }
    }, tag), _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield prisma_1.myPrisma.account.findFirst({
            where: {
                username: input.username,
                password: input.password,
            }
        });
        if (account) {
            const session = yield (new session_1.default()).createSession(account.id, input.deviceInfo, account.roleId);
            return {
                session: {
                    accountId: session.accountId,
                    token: session.token,
                    roleId: session.roleId
                },
                userInfo: {
                    fullname: account.fullname,
                    birthday: account.birthday,
                    address: account.address,
                    gender: account.gender,
                    avatarURI: account.avatarURI,
                    email: account.email,
                    phoneNumber: account.phoneNumber
                }
            };
        }
        else {
            throw (0, utilities_1.buildResponseError)(2, "Wrong information");
        }
    }), tag));
    route.post("/password/update", session_1.default.sessionMiddleware, _wrapper_1.RouteHandleWrapper.wrapCheckInput((input) => {
        if (input
            && typeof input.password === "string") {
            return input;
        }
    }, tag), _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => {
        res.locals.input = Object.assign(Object.assign({}, res.locals.input), { accountId: res.locals.session.accountId });
    }, tag), _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma_1.myPrisma.account.update({
            where: { id: input.accountId },
            data: {
                password: input.password,
            }
        });
        return true;
    }), tag));
    route.post("/password/reset", _wrapper_1.RouteHandleWrapper.wrapCheckInput((input) => {
        if (input
            && typeof input.email === "string") {
            return input;
        }
    }, tag), _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(void 0, void 0, void 0, function* () {
        const newPassword = generateRandomPassword();
        const result = yield (0, nodemailer_1.sendResetPwdMail)(input.email, newPassword);
        return true;
    }), tag));
    return route;
};
exports.AuthRoute = AuthRoute;
function generateRandomPassword() {
    const characters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLMNBVCXZ";
    const length = 8;
    const rs = [];
    for (let i = 0; i < length; i++) {
        rs.push(characters.at((0, crypto_1.randomInt)(characters.length)));
    }
    return rs.join();
}
