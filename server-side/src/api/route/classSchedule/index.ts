import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import SessionHandler from "../../handler/session";
import { parseInputDeleted } from "../utilities";
import { RouteBuilder } from "../_default";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const repo = myPrisma.classSchedule;
const tag = "ClassSchedule";

export const ClassScheduleRoute = () => {
    const searchProps: any = [];
    const sortProps = ["location", "dateStart", "dateEnd"];
    const route = Router();
    route.use(json());

    route.get("/select",
        RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag),
        RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, customInclude),
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
            classId: FieldGetter.Number(input, "classId", true),
            location: FieldGetter.String(input, "location", true),
            dateStart: FieldGetter.Date(input, "dateStart", true),
            dateEnd: FieldGetter.Date(input, "dateEnd", true),
            notes: FieldGetter.String(input, "notes", false),
            title: FieldGetter.String(input, "title", false),
        }

        return {
            data
        };
    }
}

function checkInput_Update(input: any) {
    if (input) {
        let data = {
            classId: FieldGetter.Number(input, "classId", true),
            location: FieldGetter.String(input, "location", true),
            dateStart: FieldGetter.Date(input, "dateStart", true),
            dateEnd: FieldGetter.Date(input, "dateEnd", true),
            notes: FieldGetter.String(input, "notes", false),
            title: FieldGetter.String(input, "title", false),
        }

        return {
            key: FieldGetter.Number(input, "key", true),
            data
        };
    }
}

function customFilter(input: any) {
    const rs: any = {};
    if (input.classId) {
        rs.classId = FieldGetter.Number(input, "classId", true);
    }
    if (input.dateTimeStart && input.dateTimeEnd) {
        rs.dateTimeStart = {gt: FieldGetter.Date(input, "dateTimeStart", true)};
        rs.dateTimeEnd = {lt: FieldGetter.Date(input, "dateTimeEnd", true)};
    }
    return rs;
}

function customInclude(input: any) {
    const rs: any = {};
    if (typeof input.inlude === "string") {
        const json = JSON.parse(input.include);
        if (json.class) {
            rs.class = true;
        }
    }
    return rs;
}

export const classScheduleChecker = {
    checkInput_Insert,
    checkInput_Update,
}