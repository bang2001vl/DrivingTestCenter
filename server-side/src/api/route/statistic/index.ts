import { Router } from "express";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const tag = "Statistic";

export const StatisticRoute = () => {
    const route = Router();

    route.get("/dashboard",
        RouteHandleWrapper.wrapCheckInput(input => {
            return {
                dateTimeStart: FieldGetter.Date(input, "dateTimeStart", true),
                dateTimeEnd: FieldGetter.Date(input, "dateTimeEnd", true),
            }
        }, tag, InputSource.query),
        RouteHandleWrapper.wrapHandleInput(async input => {
            const countNewStudent = await myPrisma.account.count({
                where: {
                    AND: [
                        { createdAt: { gte: input.dateTimeStart } },
                        { createdAt: { lte: input.dateTimeEnd } },
                    ],
                    roleId: 1,
                }
            });
            const countPreStartClass = await myPrisma.class.count({
                where: {
                    dateStart: {gt: input.dateTimeEnd},
                }
            });
            const countPreStartExamTest = await myPrisma.examTest.count({
                where: {
                    dateTimeStart: {gt: input.dateTimeEnd},
                }
            });
            const revenueReportDailyList = await myPrisma.revenueReportDaily.findMany({
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
            }
        }, tag)
    )

    return route;
}