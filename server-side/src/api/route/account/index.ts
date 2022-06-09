import { Response, Request, NextFunction, Router } from "express";
import multer from "multer";
import path from "path";
import { v1 } from "uuid";
import appConfig from "../../../config";
import helper from "../../../helper";
import { myPrisma } from "../../../prisma";
import SessionHandler from "../../handler/session";
import { pushToOldImage, handleCleanUp, parsePathToPublicRelative } from "../utilities";
import { RouteBuilder } from "../_default";
import { RouteHandleWrapper } from "../_wrapper";
import { AccountManagerRoute } from "./manager";
import { NativeFlutterRoute } from "./nativeflutter";

const repo = myPrisma.account;
const tag = "Account";

const DEFAULT_UPLOAD_FOLDER = path.resolve(appConfig.publicFolder, "uploads", "avatar");
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

export const AccountRoute = () => {
    const route = Router();

    route.use("/manager", AccountManagerRoute());
    route.use("/nativeflutter", NativeFlutterRoute());

    route.get("/info/self",
        SessionHandler.sessionMiddleware,
        addAccountId,
        RouteHandleWrapper.wrapHandleInput(async input =>{
            const result = await repo.findFirst({
                where: { id: input.accountId },
                select: {
                    fullname: true,
                    birthday: true,
                    address: true,
                    gender: true,
                    avatarURI: true,
                    email: true,
                    phoneNumber: true,
                }
            });
            return result;
        }, tag),
    );

    route.put("/update/self",
        SessionHandler.sessionMiddleware,
        RouteHandleWrapper.wrapMulterUpload(upload.fields([{ name: "avatar", maxCount: 1 }])),
        RouteHandleWrapper.wrapCheckInput(parseInputUpdate, tag),
        RouteHandleWrapper.wrapMiddleware(async (req, res) => {
            res.locals.input.key = res.locals.session.accountId;
        }),
        addUploadedURIs,
        cacheOldData,
        pushToOldImage(["avatarURI"]),
        RouteBuilder.buildUpdateRoute(repo, tag),
        handleCleanUp,
    );

    return route;
}

function parseInputUpdate(input: any) {
    if (input
        && typeof input.fullname === "string"
        && typeof input.address === "string"
        && new Date(input.birthday)
        && !isNaN(Number(input.gender))
    ) {
        return {
            data: {
                fullname: input.fullname,
                address: input.address,
                birthday: input.birthday,
                gender: Number(input.gender),
            }
        };
    }
}

function addUploadedURIs(req: any, res: Response, next: NextFunction) {
    if (!res.locals.error && req.files) {
        if (req.files["avatar"] && req.files["avatar"].length === 1) {
            res.locals.input.data["avatarURI"] = parsePathToPublicRelative(req.files["avatar"][0].path);
        }
        helper.logger.trace("Locals: " + JSON.stringify(res.locals, null, 2));
    }
    next();
}

const cacheOldData = RouteHandleWrapper.wrapMiddleware(async (req, res) => {
    const movieId = res.locals.input.key;
    if (movieId) {
        const old = await repo.findUnique({
            where: { id: movieId },
            select: {
                avatarURI: true
            }
        });
        helper.logger.traceWithTag(tag, "Old = " + JSON.stringify(old, null, 2));
        res.locals.old = old;
    }
}, tag, true);

const addAccountId = RouteHandleWrapper.wrapMiddleware((req, res)=>{
    res.locals.input = {
        ...res.locals.input,
        accountId: res.locals.session.accountId
    }
})