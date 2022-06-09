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
    const orderFields = ["name", "dateStart", "dateEnd", "createdAt"];

    route.get("/select",
        RouteBuilder.buildSelectInputParser(searchFields, orderFields, tag),
        RouteBuilder.buildSelectRoute(repo, tag, customFilter),
    );

    route.get("/select/include",
        RouteBuilder.buildSelectInputParser(searchFields, orderFields, tag),
        RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, customInclude),
    );

    route.get("/overview/select",
        RouteBuilder.buildSelectInputParser(searchFields, orderFields, tag),
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
            name: FieldGetter.String(input, "name", true),
            location: FieldGetter.String(input, "location", true),
            dateStart: FieldGetter.Date(input, "dateStart", true),
            dateEnd: FieldGetter.Date(input, "dateEnd", true),
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
            name: FieldGetter.String(input, "name", false),
            location: FieldGetter.String(input, "location", false),
            dateTimeStart: FieldGetter.Date(input, "dateTimeStart", false),
            dateTimeEnd: FieldGetter.Date(input, "dateTimeEnd", false),
            maxMember: FieldGetter.Number(input, "maxMember", false),
            rules: FieldGetter.String(input, "rules", false),
        }

        return {
            key: FieldGetter.Number(input, "key", true),
            data
        };
    }
}

function customFilter(input: any) {
    const rs: any = {};
    if (!isNaN(Number(input.accountId))) {
        rs.accountId = Number(input.accountId)
    }
    return rs;
}

function customInclude(input: any) {
    const rs: any = {};
    // Employee
    rs.employeeCNNs = {
        select: { employee: true },
        take: 10
    }
    return rs;
}

export const CourseRouteChecker = {
    checkInput_Insert,
    checkInput_Update,
}