import { Router } from "express";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const tag = "Schedule";

export function ScheduleRoute() {
    const route = Router();

    route.get("/select",
        RouteHandleWrapper.wrapCheckInput(input => {
            if (input) {
                return {
                    //location: FieldGetter.String(input, "location", true),
                    dateTimeStart: FieldGetter.Date(input, "dateTimeStart", true),
                    dateTimeEnd: FieldGetter.Date(input, "dateTimeEnd", true),
                }
            }
        }, tag, InputSource.query),
        RouteHandleWrapper.wrapHandleInput(async input => {
            const examTestList = await myPrisma.examTest.findMany({
                where: {
                    AND: [
                        { dateTimeStart: { gte: input.dateTimeStart, } },
                        { dateTimeStart: { lte: input.dateTimeEnd, } },
                    ]
                }
            });
            const classScheduleList = await myPrisma.classSchedule.findMany({
                where: {
                    AND: [
                        { dateTimeStart: { gte: input.dateTimeStart, } },
                        { dateTimeStart: { lte: input.dateTimeEnd, } },
                    ]
                },
                include: {
                    classes: {
                        select: {name: true}
                    }
                }
            });
            return {
                examTestList,
                classScheduleList: classScheduleList.map(e => ({
                    ...e,
                    classTitle: e.classes ? e.classes.name : "",
                })),
            }
        }, tag),
    )

    return route;
}