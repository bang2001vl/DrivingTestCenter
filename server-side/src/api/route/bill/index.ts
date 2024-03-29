import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import SessionHandler from "../../handler/session";
import { ExamTestChecker } from "../examTest";
import { buildResponseError, checkNestedInput_Insert, parseInputDeleted } from "../utilities";
import { RouteBuilder } from "../_default";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const repo = myPrisma.bill;
const tag = "Bill";

export const BillRoute = () => {
    const route = Router();
    const searchProps = ["code", "reason"];
    const orderProps = ["code", "reason", "totalPrice", "createdAt"];
    route.use(json());

    route.get("/select",
        SessionHandler.roleChecker([0, 1, 2]),
        RouteBuilder.buildSelectInputParser(searchProps, orderProps, tag),
        RouteBuilder.buildSelectRoute(repo, tag, customFilter),
    );

    route.get("/count",
        RouteBuilder.buildCountInputParser(searchProps, tag),
        RouteBuilder.buildCountRoute(repo, tag),
    );

    route.post("/insert",
        SessionHandler.roleChecker([0]),
        RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag),
        RouteBuilder.buildInsertRoute(repo, tag),
    );

    // route.put("/update",
    //     SessionHandler.roleChecker([0]),
    //     RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag),
    //     RouteBuilder.buildUpdateRoute(repo, tag),
    // )

    // route.delete("/delete",
    //     SessionHandler.roleChecker([0]),
    //     RouteHandleWrapper.wrapCheckInput(parseInputDeleted, tag, InputSource.query),
    //     RouteBuilder.buildDeletesRoute(repo, tag),
    // )

    return route;
}

function checkInput_Insert(input: any) {
    if (input) {
        const data: any = {
            studentId: FieldGetter.Number(input, "studentId"),
            classId: FieldGetter.Number(input, "classId"),
            testId: FieldGetter.Number(input, "testId"),

            totalPrice: FieldGetter.Number(input, "totalPrice"),
            reason: FieldGetter.String(input, "reason"),
            code: FieldGetter.String(input, "code"),
        };

        return {
            data
        };
    }
}

function checkInput_Update(input: any) {
    if (input) {
        const data: any = {
            studentId: FieldGetter.Number(input, "studentId"),
            classId: FieldGetter.Number(input, "classId"),
            testId: FieldGetter.Number(input, "testId"),

            totalPrice: FieldGetter.Number(input, "totalPrice"),
            reason: FieldGetter.String(input, "reason"),
            code: FieldGetter.String(input, "code"),
        }

        return {
            key: FieldGetter.Number(input, "key"),
            data
        };
    }
}

function customFilter(input: any) {
    const rs: any = {};
    if (input.id) {
        rs.id = FieldGetter.Number(input, "id", true);
    }
    return rs;
}