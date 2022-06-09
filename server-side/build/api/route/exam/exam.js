"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const session_1 = __importDefault(require("../../handler/session"));
const examTest_1 = require("../examTest");
const utilities_1 = require("../utilities");
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const repo = prisma_1.myPrisma.exam;
const tag = "Exam";
const ExamRoute = () => {
    const route = (0, express_1.Router)();
    const searchProps = ["name"];
    const orderProps = ["name", "dateStart", "dateEnd"];
    route.use((0, express_1.json)());
    route.get("/select", _default_1.RouteBuilder.buildSelectInputParser(searchProps, orderProps, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter));
    route.get("/count", _default_1.RouteBuilder.buildCountInputParser(searchProps, tag), _default_1.RouteBuilder.buildCountRoute(repo, tag));
    route.post("/insert", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag), _default_1.RouteBuilder.buildNestInsertManyCheckerRoute("examTest", "examId", examTest_1.ExamTestChecker.checkInput_Insert), _default_1.RouteBuilder.buildInsertRoute(repo, tag));
    route.put("/update", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag), _default_1.RouteBuilder.buildNestInsertManyCheckerRoute("examTest", "examId", examTest_1.ExamTestChecker.checkInput_Insert), _default_1.RouteBuilder.buildDeleteNestedData("examTest", "id"), _default_1.RouteBuilder.buildUpdateRoute(repo, tag));
    route.delete("/delete", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(utilities_1.parseInputDeleted, tag, _wrapper_1.InputSource.query), _default_1.RouteBuilder.buildDeletesRoute(repo, tag));
    return route;
};
exports.ExamRoute = ExamRoute;
function checkInput_Insert(input) {
    if (input) {
        const data = {
            name: FieldGetter_1.FieldGetter.String(input, "name"),
            type: FieldGetter_1.FieldGetter.String(input, "type"),
            dateStart: FieldGetter_1.FieldGetter.Date(input, "dateStart"),
            dateEnd: FieldGetter_1.FieldGetter.Date(input, "dateEnd"),
            dateOpen: FieldGetter_1.FieldGetter.Date(input, "dateOpen"),
            dateClose: FieldGetter_1.FieldGetter.Date(input, "dateClose"),
            maxMember: FieldGetter_1.FieldGetter.Number(input, "maxMember"),
            rules: FieldGetter_1.FieldGetter.String(input, "rules"),
            price: FieldGetter_1.FieldGetter.Number(input, "price"),
        };
        return {
            data
        };
    }
}
function checkInput_Update(input) {
    if (input) {
        const data = {
            name: FieldGetter_1.FieldGetter.String(input, "name"),
            type: FieldGetter_1.FieldGetter.String(input, "type"),
            dateStart: FieldGetter_1.FieldGetter.Date(input, "dateStart"),
            dateEnd: FieldGetter_1.FieldGetter.Date(input, "dateEnd"),
            dateOpen: FieldGetter_1.FieldGetter.Date(input, "dateOpen"),
            dateClose: FieldGetter_1.FieldGetter.Date(input, "dateClose"),
            maxMember: FieldGetter_1.FieldGetter.Number(input, "maxMember"),
            rules: FieldGetter_1.FieldGetter.String(input, "rules"),
            price: FieldGetter_1.FieldGetter.Number(input, "price"),
        };
        return {
            key: FieldGetter_1.FieldGetter.Number(input, "key"),
            data
        };
    }
}
function customFilter(input) {
    const rs = {};
    if (input.id) {
        rs.id = FieldGetter_1.FieldGetter.Number(input, "id", true);
    }
    return rs;
}
