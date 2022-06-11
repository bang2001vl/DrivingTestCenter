import { json, Router } from "express";
import { myPrisma, PrismaDelegate } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import SessionHandler from "../../handler/session";
import { buildResponseError } from "../utilities";
import { RouteBuilder } from "../_default";
import { RouteHandleWrapper } from "../_wrapper";

const tag = "CNN_Student_Class";

export const CNNRoute = () => {
    const route = Router();

    route.use(json());

    //
    /// **** Student-Class
    //
    route.post("/join/student/classes",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Student_Class, "studentId", "classId"),
    );
    route.post("/join/class/students",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Student_Class, "classId", "studentId"),
    );
    route.post("/delete/student/classes",
        SessionHandler.roleChecker([0]),
        ...buildDeleteOneManyRoute(myPrisma.cONN_Student_Class, "studentId", "classId"),
    );
    route.post("/delete/class/students",
        SessionHandler.roleChecker([0]),
        ...buildDeleteOneManyRoute(myPrisma.cONN_Student_Class, "classId", "studentId"),
    );

    //
    /// **** Student-Test
    //
    route.post("/join/student/examtests",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Student_ExamTest, "studentId", "examTestId"),
    );
    route.post("/join/examtest/students",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Student_ExamTest, "examTestId", "studentId", [
            async (input) => {
                const studentIdList = FieldGetter.Array(input, "studentIdList", true)!;
                const examTest = await myPrisma.examTest.findFirst({
                    where:{
                        id: input.examId
                    }
                });
                if(!examTest){
                    throw buildResponseError(1, "Invalid examTestId");
                }
                const examTests = await myPrisma.examTest.findMany({
                    where: {examId: examTest.examId},
                    select: {id: true},
                });
                const examTestIds = examTests.map(e => e.id);
                const duplicated = await myPrisma.cONN_Student_ExamTest.findMany({
                    where: {
                        studentId: {in: studentIdList},
                        examTestId: {in: examTestIds}
                    }
                });
                if(duplicated.length > 0){
                    throw buildResponseError(101, `Cannot join multiple examTest of one exam for students have ids in [${duplicated.map(e => e.studentId).join(", ")}]`)
                }
            }
        ]),
    );
    route.post("/delete/student/examtests",
        SessionHandler.roleChecker([0]),
        ...buildDeleteOneManyRoute(myPrisma.cONN_Student_ExamTest, "studentId", "examTestId"),
    );
    route.post("/delete/examtest/students",
        SessionHandler.roleChecker([0]),
        ...buildDeleteOneManyRoute(myPrisma.cONN_Student_ExamTest, "examTestId", "studentId"),
    );

    ///
    /// **** Employee-Class
    ///
    route.post("/join/employee/classes",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Employee_Class, "employeeId", "classId"),
    );
    route.post("/join/class/employees",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Employee_Class, "classId", "employeeId"),
    );
    route.post("/delete/employee/classes",
        SessionHandler.roleChecker([0]),
        ...buildDeleteOneManyRoute(myPrisma.cONN_Employee_Class, "employeeId", "classId"),
    );
    route.post("/delete/class/employees",
        SessionHandler.roleChecker([0]),
        ...buildDeleteOneManyRoute(myPrisma.cONN_Employee_Class, "classId", "employeeId"),
    );

    ///
    /// **** Employee-Test
    ///
    route.post("/join/employee/examtests",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Employee_ExamTest, "employeeId", "examTestId"),
    );
    route.post("/join/examtest/employees",
        SessionHandler.roleChecker([0]),
        ...buildInsertOneManyRoute(myPrisma.cONN_Employee_ExamTest, "examTestId", "employeeId"),
    );
    route.post("/delete/employee/examtests",
        SessionHandler.roleChecker([0]),
        ...buildDeleteOneManyRoute(myPrisma.cONN_Employee_ExamTest, "employeeId", "examTestId"),
    );
    route.post("/delete/examtest/employees",
        SessionHandler.roleChecker([0]),
        ...buildDeleteOneManyRoute(myPrisma.cONN_Employee_ExamTest, "examTestId", "employeeId"),
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
                    ...input,
                    [propA]: input[propA],
                    [propB]: { in: input[`${propB}List`] }
                }
            });
            return result;
        }, tag),
    ]
}

function buildInsertOneManyRoute(repo: PrismaDelegate, propA: string, propB: string, middleware?: ((input: any)=> Promise<void>)[]) {
    return [
        RouteHandleWrapper.wrapCheckInput(input => {
            console.log(input);
            return ({
                ...input,
                [propA]: FieldGetter.Number(input, propA, true),
                [`${propB}List`]: FieldGetter.Array(input, `${propB}List`, true),
            });
        }, tag),
        ...(middleware ? middleware.map(e => RouteHandleWrapper.wrapHandleInput(e, tag)) : [])
        ,
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