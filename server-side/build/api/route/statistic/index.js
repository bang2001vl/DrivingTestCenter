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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const _wrapper_1 = require("../_wrapper");
const tag = "Statistic";
const StatisticRoute = () => {
    const route = (0, express_1.Router)();
    route.get("/dashboard", _wrapper_1.RouteHandleWrapper.wrapCheckInput(input => {
        return {
            dateTimeStart: FieldGetter_1.FieldGetter.Date(input, "dateTimeStart", true),
            dateTimeEnd: FieldGetter_1.FieldGetter.Date(input, "dateTimeEnd", true),
        };
    }, tag, _wrapper_1.InputSource.query), _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(void 0, void 0, void 0, function* () {
        const countNewStudent = yield prisma_1.myPrisma.account.count({
            where: {
                AND: [
                    { createdAt: { gte: input.dateTimeStart } },
                    { createdAt: { lte: input.dateTimeEnd } },
                ],
                roleId: 1,
            }
        });
        const countPreStartClass = yield prisma_1.myPrisma.class.count({
            where: {
                dateStart: { gt: input.dateTimeEnd },
            }
        });
        const countPreStartExamTest = yield prisma_1.myPrisma.examTest.count({
            where: {
                dateTimeStart: { gt: input.dateTimeEnd },
            }
        });
        const revenueReportDailyList = yield prisma_1.myPrisma.revenueReportDaily.findMany({
            where: {
                AND: [
                    { rdate: { gte: input.dateTimeStart } },
                    { rdate: { lte: input.dateTimeEnd } },
                ],
            }
        });
        return {
            countNewStudent,
            countPreStartClass,
            countPreStartExamTest,
            revenueReportDailyList
        };
    }), tag));
    return route;
};
exports.StatisticRoute = StatisticRoute;
