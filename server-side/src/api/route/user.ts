import { json, Router, urlencoded } from "express";
import { myPrisma } from "../../prisma";
import SessionHandler from "../handler/session";
import { buildResponseError, parseInputDeleted } from "./utilities";
import { RouteBuilder } from "./_default";
import { InputSource, RouteHandleWrapper } from "./_wrapper";

const repo = myPrisma.account;
const tag = "User";

const userSelectBasic = {
    username: true,
    roleId: true,

    fullname: true,
    birthday: true,
    gender: true,
    email: true,
    phoneNumber: true,
    address: true,
    avatarURI: true,
}

export const UserRoute = () => {
    const route = Router();
    route.use(json());

    route.get("/select",
        RouteBuilder.buildSelectInputParser(["fullname"], ["fullname"], tag),
        RouteBuilder.buildSelectRoute(repo, tag, undefined, userSelectBasic),
    );

    route.get("/select/student",
        RouteBuilder.buildSelectInputParser(["fullname"], ["fullname"], tag),
        RouteBuilder.buildSelectRoute(repo, tag, (input) => ({
            roleId: 1
        }), userSelectBasic),
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