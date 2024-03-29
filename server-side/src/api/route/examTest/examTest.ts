import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import parse from "date-fns/parse";
import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import SessionHandler from "../../handler/session";
import { checkRoomAvailable } from "../schedule";
import { buildResponseError, parseInputDeleted } from "../utilities";
import { RouteBuilder } from "../_default";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const repo = myPrisma.examTest;
const tag = "ExamTest";

export const ExamTestRoute = () => {
    const searchProps = ["name"];
    const sortProps = ["name", "dateStart", "dateEnd"];
    const route = Router();
    route.use(json());

    route.get("/select",
        SessionHandler.roleChecker([0, 1, 2]),
        RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag),
        RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, () => ({ exam: true })),
    );

    route.get("/select/include",
        RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag),
        RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, () => ({ exam: true })),
    );

    route.get("/overview/select",
        RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag),
        RouteBuilder.buildSelectRoute(repo, tag, customFilter, undefined, () => ({ exam: true })),
    );

    route.get("/select/detail",
        RouteBuilder.buildSelectInputParser(searchProps, sortProps, tag),
        RouteBuilder.buildSelectRoute(repo, tag, undefined, undefined, () => ({ exam: true })),
    );

    route.get("/count",
        RouteBuilder.buildCountInputParser(searchProps, tag),
        RouteBuilder.buildCountRoute(repo, tag),
    );

    route.get("/overview/count",
        RouteBuilder.buildCountInputParser(searchProps, tag),
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

async function checkInput_Insert(input: any) {
    if (input) {
        let data = {
            examId: FieldGetter.Number(input, "examId", true),
            name: FieldGetter.String(input, "name", true),
            location: FieldGetter.String(input, "location", true),
            dateTimeStart: FieldGetter.Date(input, "dateTimeStart", true),
            dateTimeEnd: FieldGetter.Date(input, "dateTimeEnd", true),
            dateTimeStart2: FieldGetter.Date(input, "dateTimeStart2", true),
            dateTimeEnd2: FieldGetter.Date(input, "dateTimeEnd2", true),
            maxMember: FieldGetter.Number(input, "maxMember", true),
        }

        await checkConflictTime(data);

        return {
            data
        };
    }
}

async function checkInput_Update(input: any) {
    if (input) {
        let data = {
            examId: FieldGetter.Number(input, "examId", false),
            name: FieldGetter.String(input, "name", false),
            location: FieldGetter.String(input, "location", false),
            dateTimeStart: FieldGetter.Date(input, "dateTimeStart", false),
            dateTimeEnd: FieldGetter.Date(input, "dateTimeEnd", false),
            dateTimeStart2: FieldGetter.Date(input, "dateTimeStart2", false),
            dateTimeEnd2: FieldGetter.Date(input, "dateTimeEnd2", false),
            maxMember: FieldGetter.Number(input, "maxMember", false),
        }

        await checkConflictTime(data);
        await checkConflictMaxNumber(data);

        return {
            key: FieldGetter.Number(input, "key", true),
            data
        };
    }
}

async function checkConflictTime(data: any) {
    if (!isBefore(data.dateTimeStart, data.dateTimeEnd)) {
        throw buildResponseError(101, "Start time isn't smaller than end time");
    }

    const result = await checkRoomAvailable({
        location: data.location,
        dateTimeStart: data.dateTimeStart,
        dateTimeEnd: data.dateTimeEnd,
    });

    const exam = await myPrisma.exam.findFirst({
        where: {id: data.examId},
    });
    if(!exam){
        throw buildResponseError(103, "Invalid examId: Not found exam");
    }
    
    // const minDateTime = parse("00:00", "HH:mm", exam.dateStart);
    // const maxDateTime = parse("23:59", "HH:mm", exam.dateEnd)
    // if(!(isAfter(data.dateTimeStart, minDateTime) && isAfter(maxDateTime, data.dateTimeEnd))){
    //     throw buildResponseError(104, `Thời gian thi chỉ được nằm trong khoảng ${exam.dateStart} - ${exam.dateEnd}`);
    // }

    if (result) {
        throw buildResponseError(102, `Conflict with other (id=${result.id})`);
    }
}

async function checkConflictMaxNumber(data: any) {
    const currentMember = await myPrisma.cONN_Student_ExamTest.count({
        where: {
            examTestId: data.id,
        }
    });
    if(data.maxCount < currentMember){
        throw buildResponseError(103, "Số lượng không thể nhỏ hơn " + currentMember);
    }
}

function customFilter(input: any) {
    const rs: any = {};
    if (!isNaN(input.id)) {
        rs.id = Number(input.id);
    }
    if (!isNaN(input.examId)) {
        rs.examId = Number(input.examId);
    }
    return rs;
}

export const ExamTestChecker = {
    checkInput_Insert,
    checkInput_Update,
}