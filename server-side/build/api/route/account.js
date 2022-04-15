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
const AccountRouter = () => {
    const router = (0, express_1.Router)();
    router.get("/detail", session_1.default.sessionMiddleware);
    router.get("/detail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("[Access] /account/detail with body : ");
        console.log(req.body);
        try {
            const session = res.locals.session;
            const result = yield database_1.db.prisma.account.findUnique({
                where: {
                    id: session.accountId
                },
                select: {
                    student: true,
                    employee: true,
                }
            });
            if (result) {
                res.json((0, utilities_1.buildResponseSuccess)(Object.assign({}, result)));
                return;
            }
        }
        catch (e) {
            helper_1.default.logger.errorWithTag("Account", e);
        }
        res.json((0, utilities_1.buildResponseError)(400, ""));
    }));
    return router;
};
exports.default = AccountRouter;
