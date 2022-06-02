"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountManagerRoute = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = require("../../../prisma");
const session_1 = __importDefault(require("../../handler/session"));
const utilities_1 = require("../utilities");
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const repo = prisma_1.myPrisma.account;
const tag = "AccountManager";
const selectBasicInfo = {
    username: true,
    roleId: true,
    fullname: true,
    birthday: true,
    gender: true,
    email: true,
    phoneNumber: true,
    address: true,
    avatarURI: true,
};
const DEFAULT_UPLOAD_FOLDER = path_1.default.resolve(config_1.default.publicFolder, "uploads", "voucher");
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
const AccountManagerRoute = () => {
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    route.get("/select", _default_1.RouteBuilder.buildSelectInputParser(["fullname"], ["fullname"], tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, undefined, selectBasicInfo));
    route.get("/selectwithroleid", _default_1.RouteBuilder.buildSelectInputParser(["fullname"], ["fullname"], tag), _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => {
        const input = _wrapper_1.RouteHandleWrapper.getInput(req, res, _wrapper_1.InputSource.query);
        if (isNaN(Number(input.roleId))) {
            throw (0, utilities_1.buildResponseError)(1, "Invalid roleId");
        }
        res.locals.input = Object.assign(Object.assign({}, res.locals.input), { roleId: Number(input.roleId) });
    }, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, (input) => ({
        roleId: input.roleId
    }), selectBasicInfo));
    route.post("/insert", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag), _default_1.RouteBuilder.buildInsertRoute(repo, tag));
    route.put("/update", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag), _default_1.RouteBuilder.buildUpdateRoute(repo, tag));
    route.delete("/delete", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(utilities_1.parseInputDeleted, tag, _wrapper_1.InputSource.query), _default_1.RouteBuilder.buildDeletesRoute(repo, tag));
    return route;
};
exports.AccountManagerRoute = AccountManagerRoute;
function checkInput_Insert(input) {
    if (input) {
        console.log(input);
        return {
            data: input
        };
    }
}
function checkInput_Update(input) {
    if (input) {
        return {
            key: input.key,
            data: Object.assign(Object.assign({}, input), { key: undefined })
        };
    }
}
