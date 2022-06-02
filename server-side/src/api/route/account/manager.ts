import { json, Router, urlencoded } from "express";
import multer from "multer";
import path from "path";
import { v1 } from "uuid";
import appConfig from "../../../config";
import { myPrisma } from "../../../prisma";
import SessionHandler from "../../handler/session";
import { buildResponseError, parseInputDeleted } from "../utilities";
import { RouteBuilder } from "../_default";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const repo = myPrisma.account;
const tag = "AccountManager";

const selectBasicInfo = {
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

const DEFAULT_UPLOAD_FOLDER = path.resolve(appConfig.publicFolder, "uploads", "voucher");
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, DEFAULT_UPLOAD_FOLDER);
        },
        filename: (req, file, cb) => {
            const unique = v1();
            const ext = path.extname(file.originalname);
            cb(null, unique + ext);
        }
    }),
});

export const AccountManagerRoute = () => {
    const route = Router();
    route.use(json());

    route.get("/select",
        RouteBuilder.buildSelectInputParser(["fullname"], ["fullname"], tag),
        RouteBuilder.buildSelectRoute(repo, tag, undefined, selectBasicInfo),
    );

    route.get("/selectwithroleid",
        RouteBuilder.buildSelectInputParser(["fullname"], ["fullname"], tag),
        RouteHandleWrapper.wrapMiddleware((req, res)=>{
            const input = RouteHandleWrapper.getInput(req, res, InputSource.query);
            if(isNaN(Number(input.roleId))){
                throw buildResponseError(1, "Invalid roleId")
            }
            res.locals.input = {
                ...res.locals.input,
                roleId: Number(input.roleId),
            }
        }, tag),
        RouteBuilder.buildSelectRoute(repo, tag, (input) => ({
            roleId: input.roleId
        }), selectBasicInfo),
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