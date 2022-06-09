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
exports.CNNStudentClassRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const session_1 = __importDefault(require("../../handler/session"));
const _wrapper_1 = require("../_wrapper");
const tag = "CNN_Student_Class";
const CNNStudentClassRoute = () => {
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    route.post("/join/student/classes", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Student_Class, "studentId", "classId"));
    route.post("/join/class/students", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Student_Class, "classId", "studentId"));
    route.post("/join/student/examtests", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Student_ExamTest, "studentId", "examTestId"));
    route.post("/join/examtest/students", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Student_ExamTest, "examTestId", "studentId"));
    return route;
};
exports.CNNStudentClassRoute = CNNStudentClassRoute;
function buildDeleteOneManyRoute(repo, propA, propB) {
    return [
        _wrapper_1.RouteHandleWrapper.wrapCheckInput(input => ({
            [propA]: FieldGetter_1.FieldGetter.Number(input, propA, true),
            [`${propB}List`]: FieldGetter_1.FieldGetter.Array(input, `${propB}List`, true),
        }), tag),
        _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
            const result = yield repo.deleteMany({
                where: {
                    [propA]: input[propA],
                    [propB]: { in: input[`${propB}List`] }
                }
            });
            return result;
        }), tag),
    ];
}
function buildInsertOneManyRoute(repo, propA, propB) {
    return [
        _wrapper_1.RouteHandleWrapper.wrapCheckInput(input => {
            console.log(input);
            return ({
                [propA]: FieldGetter_1.FieldGetter.Number(input, propA, true),
                [`${propB}List`]: FieldGetter_1.FieldGetter.Array(input, `${propB}List`, true),
            });
        }, tag),
        _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
            console.log(input);
            const result = yield repo.createMany({
                data: input[`${propB}List`].map((e) => ({
                    [propA]: input[propA],
                    [propB]: e,
                }))
            });
            return result;
        }), tag),
    ];
}
