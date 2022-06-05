import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../../prisma";
import SessionHandler from "../../handler/session";
import { ExamTestChecker } from "../examTest";
import { buildResponseError, checkNestedInput_Insert, parseInputDeleted } from "../utilities";
import { RouteBuilder } from "../_default";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const repo = myPrisma.exam;
const tag = "Exam";

export const ExamRoute = () => {
    const route = Router();
    route.use(json());

    route.get("/select",
        RouteBuilder.buildSelectInputParser(["name"], ["name", "dateStart", "dateEnd"], tag),
        RouteBuilder.buildSelectRoute(repo, tag),
    );

    route.get("/count",
        RouteBuilder.buildCountInputParser(["name"], tag),
        RouteBuilder.buildCountRoute(repo, tag),
    );

    route.post("/insert",
        SessionHandler.roleChecker([0]),
        RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag),
        RouteBuilder.buildNestInsertManyCheckerRoute("examTest", "examId", ExamTestChecker.checkInput_Insert),
        RouteBuilder.buildInsertRoute(repo, tag),
    );

    route.put("/update",
        SessionHandler.roleChecker([0]),
        RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag),
        RouteBuilder.buildNestInsertManyCheckerRoute("examTest", "examId", ExamTestChecker.checkInput_Insert),
        RouteBuilder.buildDeleteNestedData("examTest", "id"),
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
        const data: any = {
            name: input.name,
            type: input.type,
            dateStart: input.dateStart,
            dateEnd: input.dateEnd,
            dateOpen: input.dateOpen,
            dateClose: input.name,
            maxMember: input.name,
            rules: input.name,
            price: input.name,
        }

        return {
            data
        };
    }
}

function checkInput_Update(input: any) {
    if (input) {
        const data: any = {
            name: input.name,
            type: input.type,
            dateStart: input.dateStart,
            dateEnd: input.dateEnd,
            dateOpen: input.dateOpen,
            dateClose: input.name,
            maxMember: input.name,
            rules: input.name,
            price: input.name,
        }

        return {
            key: input.key,
            data
        };
    }
}