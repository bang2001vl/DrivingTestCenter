import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import SessionHandler from "../../handler/session";
import { buildResponseError, parseInputDeleted } from "../utilities";
import { RouteBuilder } from "../_default";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const repo = myPrisma.class;
const tag = "Course";


export const CourseRoute = () => {
    const route = Router();
    route.use(json());

    const searchFields = ["name"];
    const orderFields = ["name", "dateStart", "dateEnd"];

    route.get("/select",
        RouteBuilder.buildSelectInputParser(searchFields, orderFields, tag),
        RouteBuilder.buildSelectRoute(repo, tag, customFilter),
    );

    route.get("/select/include/",
        RouteBuilder.buildSelectInputParser(["name"], ["name", "dateStart", "dateEnd"], tag),
        RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, customInclude),
    );

    route.get("/count",
        RouteBuilder.buildCountInputParser(["name"], tag),
        RouteBuilder.buildCountRoute(repo, tag, customFilter),
    );

    route.post("/insert",
        SessionHandler.roleChecker([0]),
        RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag),
        RouteBuilder.buildInsertRoute(repo, tag),
    );

    route.put("/update",
        SessionHandler.roleChecker([0]),
        RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag),
        RouteBuilder.buildUpdateRoute(repo, tag),
    )

    route.delete("/delete",
        SessionHandler.roleChecker([0]),
        RouteHandleWrapper.wrapCheckInput(parseInputDeleted, tag, InputSource.query),
        RouteBuilder.buildDeletesRoute(repo, tag),
    )

    return route;
}

function checkInput_Insert(input: any) {
    if (input) {
        let data = {
            examId: FieldGetter.Number(input, "examId", true),
            name: FieldGetter.String(input, "name", true),
            location: FieldGetter.String(input, "location", true),
            dateTimeStart: FieldGetter.Date(input, "dateTimeStart", true),
            dateTimeEnd: FieldGetter.Date(input, "dateTimeEnd", true),
            maxMember: FieldGetter.Number(input, "maxMember", true),
            price: FieldGetter.Number(input, "price", true),
            rules: FieldGetter.String(input, "rules", false),
        }

        return {
            data
        };
    }
}

function checkInput_Update(input: any) {
    if (input) {
        let data = {
            examId: FieldGetter.Number(input, "examId", false),
            name: FieldGetter.String(input, "name", false),
            location: FieldGetter.String(input, "location", false),
            dateTimeStart: FieldGetter.Date(input, "dateTimeStart", false),
            dateTimeEnd: FieldGetter.Date(input, "dateTimeEnd", false),
            maxMember: FieldGetter.Number(input, "maxMember", false),
        }

        return {
            key: FieldGetter.Number(input, "key", true),
            data
        };
    }
}

function customFilter(input: any) {
    const rs: any = {};
    if (!isNaN(Number(input.examId))) {
        rs.examId = Number(input.examId)
    }
    return rs;
}

function customInclude(input: any) {
    if (input && typeof input.include === "string") {
        try {
            const rs: any = {};
            const include = JSON.parse(input.include);
            if (include.exam) {
                rs.exam = true;
            }
            return rs;
        }
        catch (ex) { throw buildResponseError(1, "Invalid include"); }
    }
}

export const CourseRouteChecker = {
    checkInput_Insert,
    checkInput_Update,
}