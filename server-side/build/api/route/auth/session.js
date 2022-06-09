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
exports.SessionRoute = void 0;
const express_1 = require("express");
const helper_1 = __importDefault(require("../../../helper"));
const prisma_1 = require("../../../prisma");
const session_1 = __importDefault(require("../../handler/session"));
const utilities_1 = require("../utilities");
const _wrapper_1 = require("../_wrapper");
const tag = "Session";
const SessionRoute = () => {
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    route.get("/check", session_1.default.sessionMiddleware, _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json((0, utilities_1.buildResponseSuccess)([res.locals.session]));
    })));
    route.get("/list", session_1.default.sessionMiddleware, _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //helper.logger.traceWithTag(tag, JSON.stringify(res.locals.session, null, 2));
        const accountId = res.locals.session.accountId;
        const sessions = yield prisma_1.myPrisma.session.findMany({
            where: { accountId: accountId },
            select: {
                id: true,
                deviceInfo: true,
            }
        });
        res.json((0, utilities_1.buildResponseSuccess)(sessions));
    })));
    route.post("/destroy/", session_1.default.sessionMiddleware, _wrapper_1.RouteHandleWrapper.wrapCheckInput(input => {
        if (input
            && !isNaN(Number(input.id))) {
            return {
                id: Number(input.id)
            };
        }
    }, tag), _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = res.locals.input.id;
        if (!id) {
            throw (0, utilities_1.buildResponseError)(1, "Invalid input");
        }
        const target = yield prisma_1.myPrisma.session.findUnique({
            where: { id: id }
        });
        if (!target) {
            throw (0, utilities_1.buildResponseError)(2, "Session not founded");
        }
        if (target.accountId !== res.locals.session.accountId) {
            throw (0, utilities_1.buildResponseError)(3, "No permisson");
        }
        const result = yield (new session_1.default()).destroySession(id);
        res.json((0, utilities_1.buildResponseSuccess)(result));
        helper_1.default.logger.traceWithTag(tag, "Successfully destroy sessionId=" + id + " by token=" + req.headers["token"]);
    })));
    route.post("/destroy/self", session_1.default.sessionMiddleware, _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = res.locals.session.id;
        const result = yield (new session_1.default()).destroySession(id);
        res.json((0, utilities_1.buildResponseSuccess)());
        helper_1.default.logger.traceWithTag(tag, "Successfully destroy sessionId=" + id + " by token=" + req.headers["token"]);
    })));
    return route;
};
exports.SessionRoute = SessionRoute;
