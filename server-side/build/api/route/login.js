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
const express_1 = require("express");
const database_1 = require("../../database");
const helper_1 = __importDefault(require("../../helper"));
const session_1 = __importDefault(require("../handler/session"));
const utilities_1 = require("./utilities");
const LoginRouter = () => {
    const router = (0, express_1.Router)();
    router.use((0, express_1.json)());
    router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("[Access] /login with body : ");
        console.log(req.body);
        const input = req.body;
        console.log(input);
        let errorCode = 400, errorMsg = "Login failed";
        if (input
            && input.account
            && typeof input.account.username === "string"
            && typeof input.account.password === "string"
            && typeof input.deviceInfo === "string") {
            try {
                const account = yield database_1.db.prisma.account.findFirst({
                    where: {
                        username: input.account.username,
                        password: input.account.password,
                    }
                });
                if (account) {
                    helper_1.default.logger.traceWithTag("Login", `Valid account with id = ${account.id}`);
                    const session = yield session_1.default.createSession(account.id, input.deviceInfo);
                    if (session) {
                        helper_1.default.logger.traceWithTag("Login", `Created new session with id = ${session.id}`);
                        res.json((0, utilities_1.buildResponseSuccess)({
                            session: {
                                token: session.token,
                                roleId: account.roleId,
                            }
                        }));
                        return;
                    }
                }
            }
            catch (e) {
                console.log("Ex");
                helper_1.default.logger.errorWithTag("Login", e);
            }
        }
        // Failed
        res.json((0, utilities_1.buildResponseError)(errorCode, errorMsg));
    }));
    return router;
};
exports.default = LoginRouter;
