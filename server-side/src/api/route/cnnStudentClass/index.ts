import { json, Router } from "express";
import { myPrisma, PrismaDelegate } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import SessionHandler from "../../handler/session";
import { RouteBuilder } from "../_default";
import { RouteHandleWrapper } from "../_wrapper";

const tag = "CNN_Student_Class";

export const CNNStudentClassRoute = () => {
    const route = Router();

    route.use(json());

    route.post("/join/student/classes",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Student_Class, "studentId", "classId"),
    );

    route.post("/join/class/students",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Student_Class, "classId", "studentId"),
    );

    route.post("/join/student/examtests",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Student_ExamTest, "studentId", "examTestId"),
    );

    route.post("/join/examtest/students",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Student_ExamTest, "examTestId", "studentId"),
    );



    return route;
}

function buildDeleteOneManyRoute(repo: PrismaDelegate, propA: string, propB: string) {
    return [
        RouteHandleWrapper.wrapCheckInput(input => ({
            [propA]: FieldGetter.Number(input, propA, true),
            [`${propB}List`]: FieldGetter.Array(input, `${propB}List`, true),
        }), tag),
        RouteHandleWrapper.wrapHandleInput(async (input) => {
            const result = await repo.deleteMany({
                where: {
                    [propA]: input[propA],
                    [propB]: { in: input[`${propB}List`] }
                }
            });
            return result;
        }, tag),
    ]
}

function buildInsertOneManyRoute(repo: PrismaDelegate, propA: string, propB: string) {
    return [
        RouteHandleWrapper.wrapCheckInput(input => {
            console.log(input);
            return ({
                [propA]: FieldGetter.Number(input, propA, true),
                [`${propB}List`]: FieldGetter.Array(input, `${propB}List`, true),
            });
        }, tag),
        RouteHandleWrapper.wrapHandleInput(async (input) => {
            console.log(input);
            const result = await repo.createMany({
                data: input[`${propB}List`].map((e: any) => ({
                    [propA]: input[propA],
                    [propB]: e,
                }))
            });
            return result;
        }, tag),
    ]
}