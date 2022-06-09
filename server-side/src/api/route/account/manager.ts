import { json, NextFunction, Response, Router, urlencoded } from "express";
import multer from "multer";
import path from "path";
import { v1 } from "uuid";
import appConfig from "../../../config";
import helper from "../../../helper";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import SessionHandler from "../../handler/session";
import { pushToOldImage, handleCleanUp, parsePathToPublicRelative } from "../utilities";
import { RouteBuilder } from "../_default";
import { RouteHandleWrapper } from "../_wrapper";

const repo = myPrisma.account;
const tag = "AccountManager";


const selectBasicInfo = () => ({
    id: true,
    username: true,
    roleId: true,

    fullname: true,
    birthday: true,
    gender: true,
    email: true,
    phoneNumber: true,
    address: true,
    avatarURI: true,

    createdAt: true,
})

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

export const AccountManagerRoute = () => {
    const route = Router();
    route.use(json());

    route.get("/select",
        RouteBuilder.buildSelectInputParser(["fullname"], ["fullname"], tag),
        RouteBuilder.buildSelectRoute(repo, tag, customSelectFilter, selectBasicInfo),
    );

    route.get("/count",
        RouteBuilder.buildCountInputParser(["fullname"], tag),
        RouteBuilder.buildCountRoute(repo, tag, customSelectFilter),
    );

    route.post("/insert",
        SessionHandler.roleChecker([0]),
        RouteHandleWrapper.wrapMulterUpload(upload.fields([{ name: "avatar", maxCount: 1 }])),
        RouteHandleWrapper.wrapCheckInput(checkInput_Insert, tag),
        addUploadedURIs,
        RouteBuilder.buildInsertRoute(repo, tag),
        handleCleanUp,
    );

    route.put("/update",
        SessionHandler.roleChecker([0]),
        RouteHandleWrapper.wrapMulterUpload(upload.fields([{ name: "avatar", maxCount: 1 }])),
        RouteHandleWrapper.wrapCheckInput(checkInput_Update, tag),
        addUploadedURIs,
        cacheOldData,
        pushToOldImage(["avatarURI"]),
        RouteBuilder.buildUpdateRoute(repo, tag),
        handleCleanUp,
    )

    route.delete("/delete",
        SessionHandler.roleChecker([0]),
        RouteBuilder.buildKeyParser(tag),
        cacheOldData,
        pushToOldImage(["avatarURI"]),
        RouteBuilder.buildDeletesRoute(repo, tag),
        handleCleanUp,
    )

    return route;
}

function customSelectFilter(input: any) {
    const rs: any = {};
    if (input.roleId) {
        rs.roleId = FieldGetter.Number(input, "roleId", true);
        if (rs.roleId === 1) {
            if (input.examTestId) {
                rs.joingTest = { some: { examTestId: FieldGetter.Number(input, "examTestId", true) } };
            }
            if (input.notHaveExamTestId) {
                rs.joingTest = { ...rs.joingTest, none: { examTestId: FieldGetter.Number(input, "notHaveExamTestId", true) } };
            }
            if (input.classId) {
                rs.studingClass = { some: { classId: FieldGetter.Number(input, "classId", true) } };
            }
            if (input.notHaveClassId) {
                rs.studingClass = { ...rs.studingClass, none: { classId: FieldGetter.Number(input, "notHaveClassId", true) } };
            }
        }
        else if (rs.roleId === 2) {
            if (input.examTestId) {
                rs.workingTest = { some: { examTestId: FieldGetter.Number(input, "examTestId", true) } };
            }
            if (input.notHaveExamTestId) {
                rs.workingTest = { ...rs.workingTest, none: { examTestId: FieldGetter.Number(input, "notHaveExamTestId", true) } };
            }
            if (input.classId) {
                rs.teachingClass = { some: { classId: FieldGetter.Number(input, "classId", true) } };
            }
            if (input.notHaveClassId) {
                rs.teachingClass = { ...rs.teachingClass, none: { classId: FieldGetter.Number(input, "notHaveClassId", true) } };
            }
        }

        return rs;
    }
}

function checkInput_Insert(input: any) {
    if (input) {
        let data: any = {
            username: FieldGetter.String(input, "username"),
            password: FieldGetter.String(input, "password"),
            fullname: FieldGetter.String(input, "fullname"),
            email: FieldGetter.String(input, "email"),
            phoneNumber: FieldGetter.String(input, "phoneNumber"),
            address: FieldGetter.String(input, "address"),
            birthday: FieldGetter.Date(input, "birthday"),
            gender: FieldGetter.Number(input, "gender"),
            roleId: FieldGetter.Number(input, "roleId"),
        }

        return {
            data
        };
    }
}

function checkInput_Update(input: any) {
    if (input) {
        let data: any = {
            username: FieldGetter.String(input, "username"),
            password: FieldGetter.String(input, "password"),
            fullname: FieldGetter.String(input, "fullname"),
            email: FieldGetter.String(input, "email"),
            phoneNumber: FieldGetter.String(input, "phoneNumber"),
            address: FieldGetter.String(input, "address"),
            birthday: FieldGetter.Date(input, "birthday"),
            gender: FieldGetter.Number(input, "gender"),
            roleId: FieldGetter.Number(input, "roleId"),
        }

        return {
            key: FieldGetter.Number(input, "key"),
            data
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
                avatarURI: true,
            }
        });
        helper.logger.traceWithTag(tag, "Old = " + JSON.stringify(old, null, 2));
        res.locals.old = old;
    }
}, tag, true);