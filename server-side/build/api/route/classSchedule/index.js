"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classScheduleChecker = exports.ClassScheduleRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const session_1 = __importDefault(require("../../handler/session"));
const utilities_1 = require("../utilities");
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const repo = prisma_1.myPrisma.classSchedule;
const tag = "ClassSchedule";
const ClassScheduleRoute = () => {
    const searchProps = [];
    const sortProps = ["location", "dateStart", "dateEnd"];
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    route.get("/select", _default_1.RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, customInclude));
    route.get("/count", _default_1.RouteBuilder.buildCountInputParser(searchProps, tag), _default_1.RouteBuilder.buildCountRoute(repo, tag));
    route.post("/insert", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag), _default_1.RouteBuilder.buildInsertRoute(repo, tag));
    route.put("/update", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag), _default_1.RouteBuilder.buildUpdateRoute(repo, tag));
    route.delete("/delete", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(utilities_1.parseInputDeleted, tag, _wrapper_1.InputSource.query), _default_1.RouteBuilder.buildDeletesRoute(repo, tag));
    return route;
};
exports.ClassScheduleRoute = ClassScheduleRoute;
function checkInput_Insert(input) {
    if (input) {
        let data = {
            classId: FieldGetter_1.FieldGetter.Number(input, "classId", true),
            location: FieldGetter_1.FieldGetter.String(input, "location", true),
            dateStart: FieldGetter_1.FieldGetter.Date(input, "dateStart", true),
            dateEnd: FieldGetter_1.FieldGetter.Date(input, "dateEnd", true),
            notes: FieldGetter_1.FieldGetter.String(input, "notes", false),
            title: FieldGetter_1.FieldGetter.String(input, "title", false),
        };
        return {
            data
        };
    }
}
function checkInput_Update(input) {
    if (input) {
        let data = {
            classId: FieldGetter_1.FieldGetter.Number(input, "classId", true),
            location: FieldGetter_1.FieldGetter.String(input, "location", true),
            dateStart: FieldGetter_1.FieldGetter.Date(input, "dateStart", true),
            dateEnd: FieldGetter_1.FieldGetter.Date(input, "dateEnd", true),
            notes: FieldGetter_1.FieldGetter.String(input, "notes", false),
            title: FieldGetter_1.FieldGetter.String(input, "title", false),
        };
        return {
            key: FieldGetter_1.FieldGetter.Number(input, "key", true),
            data
        };
    }
}
function customFilter(input) {
    const rs = {};
    if (input.classId) {
        rs.classId = FieldGetter_1.FieldGetter.Number(input, "classId", true);
    }
    if (input.dateTimeStart && input.dateTimeEnd) {
        rs.dateTimeStart = { gt: FieldGetter_1.FieldGetter.Date(input, "dateTimeStart", true) };
        rs.dateTimeEnd = { lt: FieldGetter_1.FieldGetter.Date(input, "dateTimeEnd", true) };
    }
    return rs;
}
function customInclude(input) {
    const rs = {};
    if (typeof input.inlude === "string") {
        const json = JSON.parse(input.include);
        if (json.class) {
            rs.class = true;
        }
    }
    return rs;
}
exports.classScheduleChecker = {
    checkInput_Insert,
    checkInput_Update,
};
