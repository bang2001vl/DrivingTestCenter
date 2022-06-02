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
exports.AccountRoute = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../../config"));
const helper_1 = __importDefault(require("../../../helper"));
const prisma_1 = require("../../../prisma");
const session_1 = __importDefault(require("../../handler/session"));
const utilities_1 = require("../utilities");
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const repo = prisma_1.myPrisma.account;
const tag = "Account";
const DEFAULT_UPLOAD_FOLDER = path_1.default.resolve(config_1.default.publicFolder, "uploads", "avatar");
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, DEFAULT_UPLOAD_FOLDER);
        },
        filename: (req, file, cb) => {
            const unique = (0, uuid_1.v1)();
            const ext = path_1.default.extname(file.originalname);
            cb(null, unique + ext);
        }
    }),
});
const AccountRoute = () => {
    const route = (0, express_1.Router)();
    route.get("/info/self", session_1.default.sessionMiddleware, addAccountId, _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield repo.findFirst({
            where: { id: input.accountId },
            select: {
                fullname: true,
                birthday: true,
                address: true,
                gender: true,
                avatarURI: true,
                email: true,
                phoneNumber: true,
            }
        });
        return result;
    }), tag));
    route.put("/update/self", session_1.default.sessionMiddleware, _wrapper_1.RouteHandleWrapper.wrapMulterUpload(upload.fields([{ name: "avatar", maxCount: 1 }])), _wrapper_1.RouteHandleWrapper.wrapCheckInput(parseInputUpdate, tag), _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.locals.input.key = res.locals.session.accountId;
    })), addUploadedURIs, cacheOldData, (0, utilities_1.cacheOldImage)(["avatarURI"]), _default_1.RouteBuilder.buildUpdateRoute(repo, tag), utilities_1.handleCleanUp);
    return route;
};
exports.AccountRoute = AccountRoute;
function parseInputUpdate(input) {
    if (input
        && typeof input.fullname === "string"
        && typeof input.address === "string"
        && new Date(input.birthday)
        && !isNaN(Number(input.gender))) {
        return {
            data: {
                fullname: input.fullname,
                address: input.address,
                birthday: input.birthday,
                gender: Number(input.gender),
            }
        };
    }
}
function addUploadedURIs(req, res, next) {
    if (!res.locals.error && req.files) {
        if (req.files["avatar"] && req.files["avatar"].length === 1) {
            res.locals.input.data["avatarURI"] = (0, utilities_1.parsePathToPublicRelative)(req.files["avatar"][0].path);
        }
        helper_1.default.logger.trace("Locals: " + JSON.stringify(res.locals, null, 2));
    }
    next();
}
const cacheOldData = _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movieId = res.locals.input.key;
    if (movieId) {
        const old = yield repo.findUnique({
            where: { id: movieId },
            select: {
                avatarURI: true
            }
        });
        helper_1.default.logger.traceWithTag(tag, "Old = " + JSON.stringify(old, null, 2));
        res.locals.old = old;
    }
}), tag, true);
const addAccountId = _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => {
    res.locals.input = Object.assign(Object.assign({}, res.locals.input), { accountId: res.locals.session.accountId });
});
