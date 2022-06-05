import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../../prisma";
import SessionHandler from "../../handler/session";
import { parseInputDeleted } from "../utilities";
import { RouteBuilder } from "../_default";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const repo = myPrisma.examTest;
const tag = "ExamTest";

export const ExamTestRoute = () => {
    const route = Router();
    route.use(json());

    route.get("/select",
        RouteBuilder.buildSelectInputParser(["name"], ["name", "dateStart", "dateEnd"], tag),
        RouteBuilder.buildSelectRoute(repo, tag),
    );

    route.get("/select/include/exam",
        RouteBuilder.buildSelectInputParser(["name"], ["name", "dateStart", "dateEnd"], tag),
        RouteBuilder.buildSelectRoute(repo, tag, undefined, undefined, { exam: true }),
    );

    route.get("/count",
        RouteBuilder.buildCountInputParser(["name"], tag),
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
            examId: input.examId,
            name: input.name,
            location: input.location,
            dateTimeStart: input.dateTimeStart,
            dateTimeEnd: input.dateTimeEnd,
            maxMember: input.maxMember,
        }

        return {
            data
        };
    }
}

function checkInput_Update(input: any) {
    if (input) {
        let data = {
            examId: input.examId,
            name: input.name,
            location: input.location,
            dateTimeStart: input.dateTimeStart,
            dateTimeEnd: input.dateTimeEnd,
            maxMember: input.maxMember,
        }

        return {
            key: input.key,
            data
        };
    }
}

export const ExamTestChecker = {
    checkInput_Insert,
    checkInput_Update,
}