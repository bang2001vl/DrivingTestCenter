import e, { NextFunction, Request, Response } from "express";
import { unlinkSync } from "fs";
import multer from "multer";
import { type } from "os";
import path from "path";
import appConfig from "../../config";
import { RouteHandleWrapper } from "./_wrapper";

export function buildResponseError(code: number, meassage: string) {
    return {
        result: false,
        errorCode: code,
        errorMessage: meassage,
    };
}

export function buildResponseSuccess(data?: any) {
    return {
        result: true,
        data: data,
    };
}

export function checkArrayChange<T>(oldArr: T[], newArr: T[]) {
    const deleted = oldArr.filter(e => !newArr.includes(e));
    const added = newArr.filter(e => !oldArr.includes(e));
    //if(deleted.length < 1 && added.length < 1 ) throw Error("Invalid array");
    return {
        added,
        deleted
    }
}

export function parseInputKeys(input: any) {
    if (input && input.keys && Array.isArray(input.keys)) {
        input.keys
    }
}

export function parseStringToArrayId(str: string) {
    let keys: any[] = str.split(",");
    return keys.map((e: any) => parseInt(e));
}

export function parsePathToPublicRelative(fullpath: string) {
    return fullpath.replace(appConfig.publicFolder, "").slice(1).replace(/\\/g, "/");
}

export function parseInputDeleted(input: any, primarykeyType = "number") {
    if (input
        && input.keys
    ) {
        if (Array.isArray(input.keys)) {
            const keys: any[] = input.keys;
            if (keys.every(k => typeof k === primarykeyType)) {
                return input;
            }
        }
        if (typeof input.keys === "string") {
            return {
                keys: input.keys.split(",").map((e: any) => parseInt(e))
            };
        }
    }
}

export const pushToOldImage = (fields: string[], tag = "Utilities") => {
    return RouteHandleWrapper.wrapMiddleware((req, res) => {
        if (!res.locals.oldImages) {
            res.locals.oldImages = [];
        }
        if (res.locals.old) {
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                if (res.locals.input.data[field] && res.locals.old[field]) {
                    res.locals.oldImages.push(res.locals.old[field]);
                }
            }
        }
    }, tag, true);
}

export const handleCleanUp = (req: any, res: Response, next: NextFunction) => {
    if (res.locals.error && req.files) {
        // Delete uploaded images if occur error
        const fields = Object.keys(req.files);
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            req.files[field].forEach((e: any) => { unlinkSync(e.path) });
        }
    }
    else {
        if (res.locals.oldImages) {
            // Delete old images when success
            res.locals.oldImages.forEach((publicURI: any) => {
                if(publicURI){
                 unlinkSync(path.resolve(appConfig.publicFolder, publicURI));
                }
            });
        }
    }
    next();
}

export function uploadWrapper(upload: any) {
    return (req: any, res: Response, next: NextFunction) => {
        upload(req, res, function (err: any) {
            if (err instanceof multer.MulterError) {
                res.locals.error = buildResponseError(5, "Upload file failed");
            }
            next();
        });
    }
}

export type InsertChecker = (input: any) => { data: any } | undefined | Promise<{ data: any } | undefined>;
export type UpdateChecker = (input: any) => { data: any, key: any } | undefined | Promise<{ data: any, key: any } | undefined>;

export async function checkNestedInput_Insert(nestData: any, mainKey: string, checker: any) {
    const fakeId = 1;
    const checked = await checker({
        ...nestData,
        [mainKey]: fakeId,
    });
    if (!checked) {
        return undefined;
    }
    delete checked.data[mainKey];
    return checked;
}