"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRouter = void 0;
const express_1 = require("express");
const database_1 = require("../../database");
const session_1 = __importStar(require("../handler/session"));
const default2_1 = require("./default2");
const searchProperties = [
    "name"
];
const orderProperties = [
    "name", "type", "dateStart", "maxMember"
];
function parseInputCreate(input) {
    if (input) {
        return input;
    }
}
function parseInputUpdate(input) {
    if (input) {
        return input;
    }
}
function parseInputDelete(input) {
    if (input) {
        return input;
    }
}
const ExamRouter = () => {
    const tag = "Exam";
    const model = database_1.db.prisma.exam;
    let router = (0, express_1.Router)();
    router.use(session_1.default.roleChecker([session_1.ROLE_IDS.admin, session_1.ROLE_IDS.employee]));
    router.get("/select", default2_1.RouteBuilder.buildSelectInputParser(searchProperties, orderProperties, tag));
    router.get("/select", default2_1.RouteBuilder.buildSelectRoute(model, tag));
    router.get("/count", default2_1.RouteBuilder.buildCountInputParser(searchProperties, orderProperties, tag));
    router.get("/count", default2_1.RouteBuilder.buildCountRoute(model, tag));
    router.post("/create", default2_1.RouteBuilder.buildInputParser(parseInputCreate));
    router.post("/create", default2_1.RouteBuilder.buildInsertRoute(model, tag));
    router.put("/update", default2_1.RouteBuilder.buildInputParser(parseInputUpdate));
    router.put("/update", default2_1.RouteBuilder.buildUpdateRoute(model, tag));
    router.delete("/delete", default2_1.RouteBuilder.buildInputParser(parseInputDelete));
    router.delete("/delete", default2_1.RouteBuilder.buildDeleteRoute(model, tag));
    return router;
};
exports.ExamRouter = ExamRouter;
