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
exports.ROLE_IDS = void 0;
const uuid_1 = require("uuid");
const database_1 = require("../../database");
const helper_1 = __importDefault(require("../../helper"));
const utilities_1 = require("../route/utilities");
exports.ROLE_IDS = {
    admin: 1,
    student: 2,
    employee: 3,
};
const SessionHandler = {
    sessionMiddleware(req, res, nxt) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers["token"];
            console.log("Start: Checking token");
            if (!token || typeof token !== "string") {
                res.status(401).send("Unathourized");
                return;
            }
            try {
                const session = yield database_1.db.prisma.session.findFirst({
                    where: {
                        token: token,
                    },
                });
                if (!session) {
                    res.json((0, utilities_1.buildResponseError)(401, "Unathourized"));
                    return;
                }
                helper_1.default.logger.traceWithTag("Session", "[Accepted] Got request from session = " + JSON.stringify(session));
                res.locals.session = session;
                nxt();
            }
            catch (ex) {
                // System crashed
                console.log(ex);
                res.json((0, utilities_1.buildResponseError)(500, "Server error: We catched some unexpected exception X.X"));
            }
        });
    },
    roleChecker(roles) {
        return (req, res, nxt) => __awaiter(this, void 0, void 0, function* () {
            const token = req.headers["token"];
            console.log("Start: Checking token");
            if (!token || typeof token !== "string") {
                res.json((0, utilities_1.buildResponseError)(401, "Unathourized"));
                return;
            }
            try {
                const session = yield database_1.db.prisma.session.findFirst({
                    where: {
                        token: token,
                    },
                    include: {
                        account: {
                            select: {
                                roleId: true,
                            }
                        }
                    }
                });
                if (!session || !session.account || !roles.includes(session.account.roleId)) {
                    res.json((0, utilities_1.buildResponseError)(401, "Unathourized"));
                    return;
                }
                helper_1.default.logger.traceWithTag("Session", "[Accepted] Got request from session = " + JSON.stringify(session));
                res.locals.session = session;
                nxt();
            }
            catch (ex) {
                // System crashed
                console.log(ex);
                res.json((0, utilities_1.buildResponseError)(500, "Server error: We catched some unexpected exception X.X"));
            }
        });
    },
    createSession(accountId, deviceInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, uuid_1.v1)();
            helper_1.default.logger.traceWithTag("MYSQL, INSERT", "Start: Insert session");
            const result = yield database_1.db.prisma.session.create({
                data: {
                    token,
                    accountId,
                    deviceInfo,
                    sessionData: "{}"
                }
            });
            helper_1.default.logger.traceWithTag("MYSQL, INSERT", "Success: Inserted session with token = " + token);
            return result;
        });
    }
};
exports.default = SessionHandler;
