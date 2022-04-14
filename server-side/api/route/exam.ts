import { json, Router } from "express";
import { db } from "../../database";
import { RouteBuilder } from "./default2";
import { buildResponseError } from "./utilities";

const searchProperties = [
    "name"
];

const orderProperties = [
    "name", "type", "dateStart", "maxMember"
];

export const ExamRouter = () => {
    const tag = "Exam";
    let router = Router();

    router.get("/select", RouteBuilder.buildSelectChecker(searchProperties, orderProperties, tag));
    router.get("/select", RouteBuilder.buildSelectRoute(db.prisma.exam, tag));

    router.get("/count", RouteBuilder.buildCountChecker(searchProperties, orderProperties, tag));
    router.get("/count", RouteBuilder.buildCountRoute(db.prisma.exam, tag));

    return router;
}