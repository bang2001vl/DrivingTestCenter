"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const session_1 = __importDefault(require("../../handler/session"));
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const repo = prisma_1.myPrisma.bill;
const tag = "Bill";
const BillRoute = () => {
    const route = (0, express_1.Router)();
    const searchProps = ["code", "reason"];
    const orderProps = ["code", "reason", "totalPrice", "createdAt"];
    route.use((0, express_1.json)());
    route.get("/select", _default_1.RouteBuilder.buildSelectInputParser(searchProps, orderProps, tag), _default_1.RouteBuilder.buildSelectRoute(repo, tag, customFilter));
    route.get("/count", _default_1.RouteBuilder.buildCountInputParser(searchProps, tag), _default_1.RouteBuilder.buildCountRoute(repo, tag));
    route.post("/insert", session_1.default.roleChecker([0]), _wrapper_1.RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag), _default_1.RouteBuilder.buildInsertRoute(repo, tag));
    // route.put("/update",
    //     SessionHandler.roleChecker([0]),
    //     RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag),
    //     RouteBuilder.buildUpdateRoute(repo, tag),
    // )
    // route.delete("/delete",
    //     SessionHandler.roleChecker([0]),
    //     RouteHandleWrapper.wrapCheckInput(parseInputDeleted, tag, InputSource.query),
    //     RouteBuilder.buildDeletesRoute(repo, tag),
    // )
    return route;
};
exports.BillRoute = BillRoute;
function checkInput_Insert(input) {
    if (input) {
        const data = {
            studentId: FieldGetter_1.FieldGetter.Number(input, "studentId"),
            classId: FieldGetter_1.FieldGetter.Number(input, "classId"),
            testId: FieldGetter_1.FieldGetter.Number(input, "testId"),
            totalPrice: FieldGetter_1.FieldGetter.Number(input, "totalPrice"),
            reason: FieldGetter_1.FieldGetter.String(input, "reason"),
            code: FieldGetter_1.FieldGetter.String(input, "code"),
        };
        return {
            data
        };
    }
}
function checkInput_Update(input) {
    if (input) {
        const data = {
            studentId: FieldGetter_1.FieldGetter.Number(input, "studentId"),
            classId: FieldGetter_1.FieldGetter.Number(input, "classId"),
            testId: FieldGetter_1.FieldGetter.Number(input, "testId"),
            totalPrice: FieldGetter_1.FieldGetter.Number(input, "totalPrice"),
            reason: FieldGetter_1.FieldGetter.String(input, "reason"),
            code: FieldGetter_1.FieldGetter.String(input, "code"),
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
