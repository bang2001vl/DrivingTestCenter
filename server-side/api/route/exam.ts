import { Router } from "express";
import { db } from "../../database";
import { RouteBuilder } from "./default2";

export const ExamRouter = () => {
    const tag = "Exam";
    let router = Router();
    router = RouteBuilder.buildSelectRoute(router, (input) => input, db.prisma.exam, tag);

    return router;
}