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
exports.ExamTestChecker = exports.ExamTestRoute = void 0;
const isBefore_1 = __importDefault(require("date-fns/isBefore"));
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const session_1 = __importDefault(require("../../handler/session"));
const utilities_1 = require("../utilities");
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const repo = prisma_1.myPrisma.examTest;
const tag = "ExamTest";
const ExamTestRoute = () => {
    const searchProps = ["name"];
    const sortProps = ["name", "dateStart", "dateEnd"];
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    route.get("/select", _default_1.RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, () => ({ exam: true })));
    route.get("/select/include", _default_1.RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, () => ({ exam: true })));
    route.get("/overview/select", _default_1.RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, () => ({ exam: true })));
    route.get("/select/detail", _default_1.RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, undefined, undefined, () => ({ exam: true })));
    route.get("/count", _default_1.RouteBuilder.buildCountInputParser(searchProps, tag), _default_1.RouteBuilder.buildCountRoute(repo, tag));
    route.get("/overview/count", _default_1.RouteBuilder.buildCountInputParser(searchProps, tag), _default_1.RouteBuilder.buildCountRoute(repo, tag));
    route.post("/insert", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag), _default_1.RouteBuilder.buildInsertRoute(repo, tag));
    route.put("/update", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag), _default_1.RouteBuilder.buildUpdateRoute(repo, tag));
    route.delete("/delete", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(utilities_1.parseInputDeleted, tag, _wrapper_1.InputSource.query), _default_1.RouteBuilder.buildDeletesRoute(repo, tag));
    return route;
};
exports.ExamTestRoute = ExamTestRoute;
function checkInput_Insert(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (input) {
            let data = {
                examId: FieldGetter_1.FieldGetter.Number(input, "examId", true),
                name: FieldGetter_1.FieldGetter.String(input, "name", true),
                location: FieldGetter_1.FieldGetter.String(input, "location", true),
                dateTimeStart: FieldGetter_1.FieldGetter.Date(input, "dateTimeStart", true),
                dateTimeEnd: FieldGetter_1.FieldGetter.Date(input, "dateTimeEnd", true),
                maxMember: FieldGetter_1.FieldGetter.Number(input, "maxMember", true),
            };
            yield checkConflictTime(data);
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
                examId: FieldGetter_1.FieldGetter.Number(input, "examId", false),
                name: FieldGetter_1.FieldGetter.String(input, "name", false),
                location: FieldGetter_1.FieldGetter.String(input, "location", false),
                dateTimeStart: FieldGetter_1.FieldGetter.Date(input, "dateTimeStart", false),
                dateTimeEnd: FieldGetter_1.FieldGetter.Date(input, "dateTimeEnd", false),
                maxMember: FieldGetter_1.FieldGetter.Number(input, "maxMember", false),
            };
            yield checkConflictTime(data);
            return {
                key: FieldGetter_1.FieldGetter.Number(input, "key", true),
                data
            };
        }
    });
}
function checkConflictTime(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, isBefore_1.default)(data.dateTimeStart, data.dateTimeEnd)) {
            throw (0, utilities_1.buildResponseError)(101, "Start time isn't smaller than end time");
        }
        const result = yield repo.findFirst({
            where: {
                AND: [
                    { location: data.location },
                    {
                        NOT: {
                            OR: [
                                { dateTimeEnd: { lt: data.dateTimeStart } },
                                { dateTimeStart: { gt: data.dateTimeEnd } },
                            ]
                        }
                    }
                ]
            }
        });
        if (result) {
            throw (0, utilities_1.buildResponseError)(102, `Conflict with other (id=${result.id})`);
        }
    });
}
function customFilter(input) {
    const rs = {};
    if (!isNaN(input.id)) {
        rs.id = Number(input.id);
    }
    if (!isNaN(input.examId)) {
        rs.examId = Number(input.examId);
    }
    return rs;
}
exports.ExamTestChecker = {
    checkInput_Insert,
    checkInput_Update,
};
