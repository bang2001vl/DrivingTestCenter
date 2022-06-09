"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const _default_1 = require("../_default");
const tag = "Student";
const StudentRoute = () => {
    const route = (0, express_1.Router)();
    const searchProps = ["fullname"];
    const orderProps = ["fullname", "createdAt"];
    route.get("/select", _default_1.RouteBuilder.buildSelectInputParser(searchProps, orderProps, tag), _default_1.RouteBuilder.buildSelectRoute(prisma_1.myPrisma.account, tag, customFilter));
    route.post("/join/classes");
    return route;
};
exports.StudentRoute = StudentRoute;
function customFilter(input) {
    const rs = {
        roleId: 1
    };
    if (input.classId) {
        rs.studingClass = {
            some: {
                classId: FieldGetter_1.FieldGetter.Number(input, "classId", true),
            }
        };
    }
    if (input.examTestId) {
        rs.joingTest = {
            some: {
                examTestId: FieldGetter_1.FieldGetter.Number(input, "examTestId", true),
            }
        };
    }
    return rs;
}
