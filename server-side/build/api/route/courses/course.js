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
exports.CourseRouteChecker = exports.CourseRoute = void 0;
const isBefore_1 = __importDefault(require("date-fns/isBefore"));
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const session_1 = __importDefault(require("../../handler/session"));
const utilities_1 = require("../utilities");
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const repo = prisma_1.myPrisma.class;
const tag = "Course";
const CourseRoute = () => {
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    const searchFields = ["name"];
    const orderFields = ["name", "dateStart", "dateEnd", "createdAt"];
    route.get("/select", session_1.default.roleChecker([0, 1, 2]), _default_1.RouteBuilder.buildSelectInputParser(searchFields, orderFields, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter));
    route.get("/select/include", _default_1.RouteBuilder.buildSelectInputParser(searchFields, orderFields, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, customInclude));
    route.get("/overview/select", _default_1.RouteBuilder.buildSelectInputParser(searchFields, orderFields, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, customInclude));
    route.get("/count", _default_1.RouteBuilder.buildCountInputParser(["name"], tag), _default_1.RouteBuilder.buildCountRoute(repo, tag, customFilter));
    route.post("/insert", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag), _default_1.RouteBuilder.buildInsertRoute(repo, tag));
    route.put("/update", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag), _default_1.RouteBuilder.buildUpdateRoute(repo, tag));
    route.delete("/delete", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(utilities_1.parseInputDeleted, tag, _wrapper_1.InputSource.query), _default_1.RouteBuilder.buildDeletesRoute(repo, tag));
    return route;
};
exports.CourseRoute = CourseRoute;
function checkInput_Insert(input) {
    if (input) {
        let data = {
            name: FieldGetter_1.FieldGetter.String(input, "name", true),
            location: FieldGetter_1.FieldGetter.String(input, "location", true),
            dateStart: FieldGetter_1.FieldGetter.Date(input, "dateStart", true),
            dateEnd: FieldGetter_1.FieldGetter.Date(input, "dateEnd", true),
            maxMember: FieldGetter_1.FieldGetter.Number(input, "maxMember", true),
            price: FieldGetter_1.FieldGetter.Number(input, "price", true),
            rules: FieldGetter_1.FieldGetter.String(input, "rules", false),
        };
        return {
            data
        };
    }
}
function checkInput_Update(input) {
    if (input) {
        let data = {
            name: FieldGetter_1.FieldGetter.String(input, "name", false),
            location: FieldGetter_1.FieldGetter.String(input, "location", false),
            dateStart: FieldGetter_1.FieldGetter.Date(input, "dateStart", false),
            dateEnd: FieldGetter_1.FieldGetter.Date(input, "dateEnd", false),
            maxMember: FieldGetter_1.FieldGetter.Number(input, "maxMember", false),
            rules: FieldGetter_1.FieldGetter.String(input, "rules", false),
        };
        return {
            key: FieldGetter_1.FieldGetter.Number(input, "key", true),
            data
        };
    }
}
function checkConflictTime(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, isBefore_1.default)(data.dateStart, data.dateEnd)) {
            throw (0, utilities_1.buildResponseError)(101, "Start time isn't smaller than end time");
        }
    });
}
function checkConflictMaxNumber(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentMember = yield prisma_1.myPrisma.cONN_Student_Class.count({
            where: {
                classId: data.id,
            }
        });
        if (data.maxCount < currentMember) {
            throw (0, utilities_1.buildResponseError)(103, "Số lượng không thể nhỏ hơn " + currentMember);
        }
    });
}
function customFilter(input) {
    const rs = {};
    if (!isNaN(Number(input.id))) {
        rs.id = Number(input.id);
    }
    if (!isNaN(Number(input.accountId))) {
        rs.accountId = Number(input.accountId);
    }
    return rs;
}
function customInclude(input) {
    const rs = {};
    // Employee
    rs.employeeCNNs = {
        select: { employee: true },
        take: 10
    };
    return rs;
}
exports.CourseRouteChecker = {
    checkInput_Insert,
    checkInput_Update,
};
