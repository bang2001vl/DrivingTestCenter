import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../prisma";
import SessionHandler from "../handler/session";
import { parseInputDeleted } from "./utilities";
import { RouteBuilder } from "./_default";
import { InputSource, RouteHandleWrapper } from "./_wrapper";

const repo = myPrisma.examTest;
const tag = "ExamTest";

export const ExamTestRoute = () => {
    const route = Router();
    route.use(json());

    route.get("/select",
        RouteBuilder.buildSelectInputParser(["name"], ["name", "dateStart", "dateEnd"], tag),
        RouteBuilder.buildSelectRoute(repo, tag),
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
        console.log(input);

        return {
            data: input
        };
    }
}

function checkInput_Update(input: any) {
    if (input) {
        return {
            key: input.key,
            data: {
                ...input,
                key: undefined,
            }
        };
    }
}