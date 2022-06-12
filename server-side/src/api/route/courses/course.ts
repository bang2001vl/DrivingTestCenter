import isBefore from "date-fns/isBefore";
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
        SessionHandler.roleChecker([0, 1, 2]),
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
            dateStart: FieldGetter.Date(input, "dateStart", false),
            dateEnd: FieldGetter.Date(input, "dateEnd", false),
            maxMember: FieldGetter.Number(input, "maxMember", false),
            rules: FieldGetter.String(input, "rules", false),
        }

        return {
            key: FieldGetter.Number(input, "key", true),
            data
        };
    }
}

async function checkConflictTime(data: any) {
    if (!isBefore(data.dateStart, data.dateEnd)) {
        throw buildResponseError(101, "Start time isn't smaller than end time");
    }
}

async function checkConflictMaxNumber(data: any) {
    const currentMember = await myPrisma.cONN_Student_Class.count({
        where: {
            classId: data.id,
        }
    });
    if(data.maxCount < currentMember){
        throw buildResponseError(103, "Số lượng không thể nhỏ hơn " + currentMember);
    }
}

function customFilter(input: any) {
    const rs: any = {};
    if (!isNaN(Number(input.id))) {
        rs.id = Number(input.id)
    }
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