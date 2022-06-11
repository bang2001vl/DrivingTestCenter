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
exports.checkRoomAvailable = exports.ScheduleRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const _wrapper_1 = require("../_wrapper");
const tag = "Schedule";
function ScheduleRoute() {
    const route = (0, express_1.Router)();
    route.get("/select", _wrapper_1.RouteHandleWrapper.wrapCheckInput(input => {
        if (input) {
            return {
                //location: FieldGetter.String(input, "location", true),
                dateTimeStart: FieldGetter_1.FieldGetter.Date(input, "dateTimeStart", true),
                dateTimeEnd: FieldGetter_1.FieldGetter.Date(input, "dateTimeEnd", true),
            };
        }
    }, tag, _wrapper_1.InputSource.query), _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
        const examTestList = yield prisma_1.myPrisma.examTest.findMany({
            where: {
                AND: [
                    { dateTimeStart: { gte: input.dateTimeStart, } },
                    { dateTimeStart: { lte: input.dateTimeEnd, } },
                ]
            }
        });
        const classScheduleList = yield prisma_1.myPrisma.classSchedule.findMany({
            where: {
                AND: [
                    { dateTimeStart: { gte: input.dateTimeStart, } },
                    { dateTimeStart: { lte: input.dateTimeEnd, } },
                ]
            },
            include: {
                classes: {
                    select: { name: true }
                }
            }
        });
        return {
            examTestList,
            classScheduleList: classScheduleList.map(e => (Object.assign(Object.assign({}, e), { classTitle: e.classes ? e.classes.name : "" }))),
        };
    }), tag));
    return route;
}
exports.ScheduleRoute = ScheduleRoute;
function checkRoomAvailable(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const examSchedules = yield prisma_1.myPrisma.examTest.findFirst({
            where: {
                AND: [
                    { location: data.location },
                    {
                        NOT: {
                            OR: [
                                { dateTimeEnd: { lt: data.dateTimeStart } },
                                { dateTimeStart: { gt: data.dateTimeEnd } },
                            ]
                        }
                    }
                ]
            }
        });
        if (examSchedules) {
            return examSchedules;
        }
        const classSchedules = yield prisma_1.myPrisma.classSchedule.findFirst({
            where: {
                AND: [
                    { location: data.location },
                    {
                        NOT: {
                            OR: [
                                { dateTimeEnd: { lt: data.dateTimeStart } },
                                { dateTimeStart: { gt: data.dateTimeEnd } },
                            ]
                        }
                    }
                ]
            }
        });
        if (classSchedules) {
            return classSchedules;
        }
        return undefined;
    });
}
exports.checkRoomAvailable = checkRoomAvailable;
