"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamTestRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const session_1 = __importDefault(require("../../handler/session"));
const utilities_1 = require("../utilities");
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const repo = prisma_1.myPrisma.examTest;
const tag = "ExamTest";
const ExamTestRoute = () => {
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    route.get("/select", _default_1.RouteBuilder.buildSelectInputParser(["name"], ["name", "dateStart", "dateEnd"], tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag));
    route.get("/select/include/exam", _default_1.RouteBuilder.buildSelectInputParser(["name"], ["name", "dateStart", "dateEnd"], tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, undefined, undefined, { exam: true }));
    route.get("/count", _default_1.RouteBuilder.buildCountInputParser(["name"], tag), _default_1.RouteBuilder.buildCountRoute(repo, tag));
    route.post("/insert", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag), _default_1.RouteBuilder.buildInsertRoute(repo, tag));
    route.put("/update", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag), _default_1.RouteBuilder.buildUpdateRoute(repo, tag));
    route.delete("/delete", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(utilities_1.parseInputDeleted, tag, _wrapper_1.InputSource.query), _default_1.RouteBuilder.buildDeletesRoute(repo, tag));
    return route;
};
exports.ExamTestRoute = ExamTestRoute;
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
