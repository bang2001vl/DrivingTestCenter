"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRouteChecker = exports.CourseRoute = void 0;
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
    const orderFields = ["name", "dateStart", "dateEnd"];
    route.get("/select", _default_1.RouteBuilder.buildSelectInputParser(searchFields, orderFields, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter));
    route.get("/select/include/", _default_1.RouteBuilder.buildSelectInputParser(["name"], ["name", "dateStart", "dateEnd"], tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, customInclude));
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
            examId: FieldGetter_1.FieldGetter.Number(input, "examId", true),
            name: FieldGetter_1.FieldGetter.String(input, "name", true),
            location: FieldGetter_1.FieldGetter.String(input, "location", true),
            dateTimeStart: FieldGetter_1.FieldGetter.Date(input, "dateTimeStart", true),
            dateTimeEnd: FieldGetter_1.FieldGetter.Date(input, "dateTimeEnd", true),
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
            examId: FieldGetter_1.FieldGetter.Number(input, "examId", false),
            name: FieldGetter_1.FieldGetter.String(input, "name", false),
            location: FieldGetter_1.FieldGetter.String(input, "location", false),
            dateTimeStart: FieldGetter_1.FieldGetter.Date(input, "dateTimeStart", false),
            dateTimeEnd: FieldGetter_1.FieldGetter.Date(input, "dateTimeEnd", false),
            maxMember: FieldGetter_1.FieldGetter.Number(input, "maxMember", false),
        };
        return {
            key: FieldGetter_1.FieldGetter.Number(input, "key", true),
            data
        };
    }
}
function customFilter(input) {
    const rs = {};
    if (!isNaN(Number(input.examId))) {
        rs.examId = Number(input.examId);
    }
    return rs;
}
function customInclude(input) {
    if (input && typeof input.include === "string") {
        try {
            const rs = {};
            const include = JSON.parse(input.include);
            if (include.exam) {
                rs.exam = true;
            }
            return rs;
        }
        catch (ex) {
            throw (0, utilities_1.buildResponseError)(1, "Invalid include");
        }
    }
}
exports.CourseRouteChecker = {
    checkInput_Insert,
    checkInput_Update,
};
