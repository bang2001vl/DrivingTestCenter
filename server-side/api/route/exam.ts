import { Router } from "express";
import { db } from "../../database";
import SessionHandler, { ROLE_IDS } from "../handler/session";
import { RouteBuilder } from "./default2";

const searchProperties = [
    "name"
];

const orderProperties = [
    "name", "type", "dateStart", "maxMember"
];

function parseInputCreate(input: any) {
    if (input) {
        return input;
    }
}

function parseInputUpdate(input: any) {
    if (input) {
        return input;
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

    router.use(SessionHandler.roleChecker([ROLE_IDS.admin, ROLE_IDS.employee]))

    router.get("/select", RouteBuilder.buildSelectInputParser(searchProperties, orderProperties, tag));
    router.get("/select", RouteBuilder.buildSelectRoute(model, tag));

    router.get("/count", RouteBuilder.buildCountInputParser(searchProperties, orderProperties, tag));
    router.get("/count", RouteBuilder.buildCountRoute(model, tag));

    router.post("/create", RouteBuilder.buildInputParser(parseInputCreate));
    router.post("/create", RouteBuilder.buildInsertRoute(model, tag));

    router.put("/update", RouteBuilder.buildInputParser(parseInputUpdate));
    router.put("/update", RouteBuilder.buildUpdateRoute(model, tag));

    router.delete("/delete", RouteBuilder.buildInputParser(parseInputDelete));
    router.delete("/delete", RouteBuilder.buildDeleteRoute(model, tag));

    return router;
}