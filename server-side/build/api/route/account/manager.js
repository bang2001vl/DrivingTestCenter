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
exports.AccountManagerRoute = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../../config"));
const helper_1 = __importDefault(require("../../../helper"));
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const session_1 = __importDefault(require("../../handler/session"));
const utilities_1 = require("../utilities");
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const repo = prisma_1.myPrisma.account;
const tag = "AccountManager";
const selectBasicInfo = () => ({
    id: true,
    username: true,
    roleId: true,
    fullname: true,
    birthday: true,
    gender: true,
    email: true,
    phoneNumber: true,
    address: true,
    avatarURI: true,
    createdAt: true,
});
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
const AccountManagerRoute = () => {
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    route.get("/select", _default_1.RouteBuilder.buildSelectInputParser(["fullname"], ["fullname"], tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customSelectFilter, selectBasicInfo));
    //     route.get("/test",
    //     RouteBuilder.buildSelectInputParser(["fullname"], ["fullname"], tag),
    //     RouteHandleWrapper.wrapMiddleware((req,res)=>{
    //         repo.findMany().then(r =>res.json(r));
    //     }),
    // );
    route.get("/count", _default_1.RouteBuilder.buildCountInputParser(["fullname"], tag), _default_1.RouteBuilder.buildCountRoute(repo, tag, customSelectFilter));
    route.post("/insert", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapMulterUpload(upload.fields([{ name: "avatar", maxCount: 1 }])), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag), addUploadedURIs, _default_1.RouteBuilder.buildInsertRoute(repo, tag), utilities_1.handleCleanUp);
    route.put("/update", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapMulterUpload(upload.fields([{ name: "avatar", maxCount: 1 }])), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag), addUploadedURIs, cacheOldData, (0, utilities_1.pushToOldImage)(["avatarURI"]), _default_1.RouteBuilder.buildUpdateRoute(repo, tag), utilities_1.handleCleanUp);
    route.delete("/delete", session_1.default.roleChecker([0]), _default_1.RouteBuilder.buildKeyParser(tag), cacheOldData, _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => {
        res.locals.oldImages = [
            res.locals.old["avatarURI"],
        ];
    }), _default_1.RouteBuilder.buildDeleteSingleRoute(repo, tag), utilities_1.handleCleanUp);
    return route;
};
exports.AccountManagerRoute = AccountManagerRoute;
function customSelectFilter(input) {
    const rs = {};
    if (input.roleId) {
        rs.roleId = FieldGetter_1.FieldGetter.Number(input, "roleId", true);
        if (rs.roleId === 1) {
            if (input.examTestId) {
                rs.joingTest = { some: { examTestId: FieldGetter_1.FieldGetter.Number(input, "examTestId", true) } };
            }
            if (input.notHaveExamTestId) {
                rs.joingTest = Object.assign(Object.assign({}, rs.joingTest), { none: { examTestId: FieldGetter_1.FieldGetter.Number(input, "notHaveExamTestId", true) } });
            }
            if (input.classId) {
                rs.studingClass = { some: { classId: FieldGetter_1.FieldGetter.Number(input, "classId", true) } };
            }
            if (input.notHaveClassId) {
                rs.studingClass = Object.assign(Object.assign({}, rs.studingClass), { none: { classId: FieldGetter_1.FieldGetter.Number(input, "notHaveClassId", true) } });
            }
        }
        else if (rs.roleId === 2) {
            if (input.examTestId) {
                rs.workingTest = { some: { examTestId: FieldGetter_1.FieldGetter.Number(input, "examTestId", true) } };
            }
            if (input.notHaveExamTestId) {
                rs.workingTest = Object.assign(Object.assign({}, rs.workingTest), { none: { examTestId: FieldGetter_1.FieldGetter.Number(input, "notHaveExamTestId", true) } });
            }
            if (input.classId) {
                rs.teachingClass = { some: { classId: FieldGetter_1.FieldGetter.Number(input, "classId", true) } };
            }
            if (input.notHaveClassId) {
                rs.teachingClass = Object.assign(Object.assign({}, rs.teachingClass), { none: { classId: FieldGetter_1.FieldGetter.Number(input, "notHaveClassId", true) } });
            }
        }
    }
    if (input.id) {
        rs.id = FieldGetter_1.FieldGetter.Number(input, "id", true);
    }
    return rs;
}
function checkInput_Insert(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (input) {
            console.log(input);
            let data = {
                username: FieldGetter_1.FieldGetter.String(input, "username", true),
                password: FieldGetter_1.FieldGetter.String(input, "password", true),
                fullname: FieldGetter_1.FieldGetter.String(input, "fullname", true),
                email: FieldGetter_1.FieldGetter.String(input, "email", true),
                phoneNumber: FieldGetter_1.FieldGetter.String(input, "phoneNumber", true),
                address: FieldGetter_1.FieldGetter.String(input, "address", true),
                birthday: FieldGetter_1.FieldGetter.Date(input, "birthday", true),
                gender: FieldGetter_1.FieldGetter.Number(input, "gender", true),
                roleId: FieldGetter_1.FieldGetter.Number(input, "roleId", false),
            };
            yield checkDuplicate(data);
            return {
                data
            };
        }
    });
}
function checkInput_Update(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (input) {
            let data = {
                username: FieldGetter_1.FieldGetter.String(input, "username"),
                password: FieldGetter_1.FieldGetter.String(input, "password"),
                fullname: FieldGetter_1.FieldGetter.String(input, "fullname"),
                email: FieldGetter_1.FieldGetter.String(input, "email"),
                phoneNumber: FieldGetter_1.FieldGetter.String(input, "phoneNumber"),
                address: FieldGetter_1.FieldGetter.String(input, "address"),
                birthday: FieldGetter_1.FieldGetter.Date(input, "birthday"),
                gender: FieldGetter_1.FieldGetter.Number(input, "gender"),
                roleId: FieldGetter_1.FieldGetter.Number(input, "roleId"),
            };
            yield checkDuplicate(data);
            return {
                key: FieldGetter_1.FieldGetter.Number(input, "key"),
                data
            };
        }
    });
}
function checkDuplicate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield repo.findFirst({
            where: {
                username: data.username,
            }
        });
        if (result) {
            if (result.username === data.username) {
                throw (0, utilities_1.buildResponseError)(101, "Duplicated username");
            }
        }
    });
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
    const key = res.locals.input.key;
    if (key) {
        const old = yield repo.findUnique({
            where: { id: key },
            select: {
                avatarURI: true,
            }
        });
        if (!old) {
            throw (0, utilities_1.buildResponseError)(1, "Not found key");
        }
        helper_1.default.logger.traceWithTag(tag, "Old = " + JSON.stringify(old, null, 2));
        res.locals.old = old;
    }
}), tag, true);
