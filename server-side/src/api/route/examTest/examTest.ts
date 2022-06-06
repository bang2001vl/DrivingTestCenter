import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
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
        RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, ()=>({ exam: true })),
    );

    route.get("/select/detail",
    RouteBuilder.buildSelectInputParser(["name"], ["name", "dateStart", "dateEnd"], tag),
    RouteBuilder.buildSelectRoute(repo, tag, undefined, undefined, ()=>({ exam: true })),
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
            examId: FieldGetter.Number(input, "examId", true),
            name: FieldGetter.String(input, "name", true),
            location: FieldGetter.String(input, "location", true),
            dateTimeStart: FieldGetter.Date(input, "dateTimeStart", true),
            dateTimeEnd: FieldGetter.Date(input, "dateTimeEnd", true),
            maxMember: FieldGetter.Number(input, "maxMember", true),
        }

        return {
            data
        };
    }
}

function checkInput_Update(input: any) {
    if (input) {
        let data = {
            examId: FieldGetter.Number(input, "examId", false),
            name: FieldGetter.String(input, "name", false),
            location: FieldGetter.String(input, "location", false),
            dateTimeStart: FieldGetter.Date(input, "dateTimeStart", false),
            dateTimeEnd: FieldGetter.Date(input, "dateTimeEnd", false),
            maxMember: FieldGetter.Number(input, "maxMember", false),
        }

        return {
            key: input.key,
            data
        };
    }
}

function customFilter(input: any){
    const rs: any = {};
    if(!isNaN(input.examId)){
        rs.examId = Number(input.examId);
    }
    return rs;
}

export const ExamTestChecker = {
    checkInput_Insert,
    checkInput_Update,
}