import { json, Router } from "express";
import { db } from "../../database";
import helper from "../../helper";
import TimeHelper from "../../helper/time";
import SessionHandler, { ROLE_IDS } from "../handler/session";
import { RouteBuilder, RouteHandleWrapper } from "./default2";

const searchProperties = [
    "name"
];

const orderProperties = [
    "name", "type", "dateStart", "maxMember"
];

function parseInputCreate(input: any) {
    if (input
        && input.data) {
        const data = input.data
        return {
            data: {
                name: data.name,
                type: data.type,
                dateOpen: data.dateOpen,
                dateClose: data.dateClose,
                dateStart: data.dateStart,
                dateEnd: data.dateEnd,
                maxMember: parseInt(data.maxMember),
                rules: data.rules,
                price: parseInt(data.price),
            }
        };
    }
}

function parseInputUpdate(input: any) {
    if (input
        && input.data) {
        const data = input.data
        return {
            key: parseInt(input.key),
            data: {
                name: data.name,
                type: data.type,
                dateOpen: data.dateOpen,
                dateClose: data.dateClose,
                dateStart: data.dateStart,
                dateEnd: data.dateEnd,
                maxMember: parseInt(data.maxMember),
                rules: data.rules,
                price: parseInt(data.price),
            }
        };
    }
}

function parseInputDelete(input: any) {
    if (input) {
        return input;
    }
}

export const ExamRouter = () => {
    const tag = "Exam";
    const model = db.prisma.exam;
    let router = Router();

    router.use(json());
    router.use(SessionHandler.roleChecker([ROLE_IDS.admin, ROLE_IDS.employee]))

    router.get("/select", RouteBuilder.buildSelectInputParser(searchProperties, orderProperties, tag));
    router.get("/select", RouteBuilder.buildSelectRoute(model, tag));

    router.get("/count", RouteBuilder.buildCountInputParser(searchProperties, orderProperties, tag));
    router.get("/count", RouteBuilder.buildCountRoute(model, tag));

    router.post("/create", RouteHandleWrapper.wrapCheckInput(parseInputCreate, tag));
    router.post("/create", RouteBuilder.buildInsertRoute(model, tag));

    router.put("/update", RouteHandleWrapper.wrapCheckInput(parseInputUpdate, tag));
    router.put("/update", RouteBuilder.buildUpdateRoute(model, tag));

    router.delete("/delete", RouteHandleWrapper.wrapCheckInput(parseInputDelete, tag));
    router.delete("/delete", RouteBuilder.buildDeleteRoute(model, tag));

    return router;
}