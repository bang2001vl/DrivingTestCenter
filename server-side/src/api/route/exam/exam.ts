import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
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
        RouteBuilder.buildSelectRoute(repo, tag, customFilter),
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
            name: FieldGetter.String(input, "name"),
            type: FieldGetter.String(input, "type"),
            dateStart: FieldGetter.Date(input, "dateStart"),
            dateEnd: FieldGetter.Date(input, "dateEnd"),
            dateOpen: FieldGetter.Date(input, "dateOpen"),
            dateClose: FieldGetter.Date(input, "dateClose"),
            maxMember: FieldGetter.Number(input, "maxMember"),
            rules: FieldGetter.String(input, "rules"),
            price: FieldGetter.Number(input, "price"),
        }

        return {
            data
        };
    }
}

function checkInput_Update(input: any) {
    if (input) {
        const data: any = {
            name: FieldGetter.String(input, "name"),
            type: FieldGetter.String(input, "type"),
            dateStart: FieldGetter.Date(input, "dateStart"),
            dateEnd: FieldGetter.Date(input, "dateEnd"),
            dateOpen: FieldGetter.Date(input, "dateOpen"),
            dateClose: FieldGetter.Date(input, "dateClose"),
            maxMember: FieldGetter.Number(input, "maxMember"),
            rules: FieldGetter.String(input, "rules"),
            price: FieldGetter.Number(input, "price"),
        }

        return {
            key: FieldGetter.Number(input, "key"),
            data
        };
    }
}

function customFilter(input: any){
    const rs: any = {};
    if(input.id){        
        rs.id = FieldGetter.Number(input, "id", true);
    }
    return rs;
}