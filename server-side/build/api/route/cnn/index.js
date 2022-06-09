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
exports.CNNRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const session_1 = __importDefault(require("../../handler/session"));
const _wrapper_1 = require("../_wrapper");
const tag = "CNN_Student_Class";
const CNNRoute = () => {
    const route = (0, express_1.Router)();
    route.use((0, express_1.json)());
    //
    /// **** Student-Class
    //
    route.post("/join/student/classes", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Student_Class, "studentId", "classId"));
    route.post("/join/class/students", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Student_Class, "classId", "studentId"));
    route.post("/delete/student/classes", session_1.default.roleChecker([0]), ...buildDeleteOneManyRoute(prisma_1.myPrisma.cONN_Student_Class, "studentId", "classId"));
    route.post("/delete/class/students", session_1.default.roleChecker([0]), ...buildDeleteOneManyRoute(prisma_1.myPrisma.cONN_Student_Class, "classId", "studentId"));
    //
    /// **** Student-Test
    //
    route.post("/join/student/examtests", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Student_ExamTest, "studentId", "examTestId"));
    route.post("/join/examtest/students", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Student_ExamTest, "examTestId", "studentId"));
    route.post("/delete/student/examtests", session_1.default.roleChecker([0]), ...buildDeleteOneManyRoute(prisma_1.myPrisma.cONN_Student_ExamTest, "studentId", "examTestId"));
    route.post("/delete/examtest/students", session_1.default.roleChecker([0]), ...buildDeleteOneManyRoute(prisma_1.myPrisma.cONN_Student_ExamTest, "examTestId", "studentId"));
    ///
    /// **** Employee-Class
    ///
    route.post("/join/employee/classes", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Employee_Class, "employeeId", "classId"));
    route.post("/join/class/employees", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Employee_Class, "classId", "employeeId"));
    route.post("/delete/employee/classes", session_1.default.roleChecker([0]), ...buildDeleteOneManyRoute(prisma_1.myPrisma.cONN_Employee_Class, "employeeId", "classId"));
    route.post("/delete/class/employees", session_1.default.roleChecker([0]), ...buildDeleteOneManyRoute(prisma_1.myPrisma.cONN_Employee_Class, "classId", "employeeId"));
    ///
    /// **** Employee-Test
    ///
    route.post("/join/employee/examtests", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Employee_ExamTest, "employeeId", "examTestId"));
    route.post("/join/examtest/employees", session_1.default.roleChecker([0]), ...buildInsertOneManyRoute(prisma_1.myPrisma.cONN_Employee_ExamTest, "examTestId", "employeeId"));
    route.post("/delete/employee/examtests", session_1.default.roleChecker([0]), ...buildDeleteOneManyRoute(prisma_1.myPrisma.cONN_Employee_ExamTest, "employeeId", "examTestId"));
    route.post("/delete/examtest/employees", session_1.default.roleChecker([0]), ...buildDeleteOneManyRoute(prisma_1.myPrisma.cONN_Employee_ExamTest, "examTestId", "employeeId"));
    return route;
};
exports.CNNRoute = CNNRoute;
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
