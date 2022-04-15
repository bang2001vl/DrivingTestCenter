import { Router, json, Request, Response, NextFunction } from "express";
import { URL } from "url";
import { PrismaDelegate } from "../../database/prisma";
import helper from "../../helper";
import { buildResponseError, buildResponseSuccess } from "./utilities";

export enum InputSource {
    body, query, locals
}

function getInput(req: Request, res: Response, source: InputSource) {
    if (source === InputSource.body) {
        return req.body;
    }
    if (source === InputSource.query) {
        return req.query;
    }
    if (source === InputSource.locals) {
        return res.locals.input;
    }
}

export const RouteBuilder = {
    buildInsertRoute(repo: PrismaDelegate, tag: string) {
        return RouteHandleWrapper.wrapHandle(async (input) => {
            const result = await repo.create({
                data: input.data
            });
        }, tag);
    },

    buildUpdateRoute(repo: PrismaDelegate, tag: string, primarykeyName = "id") {
        return RouteHandleWrapper.wrapHandle(async (input) => {
            const result = await repo.update({
                where: {
                    [primarykeyName]: input.key
                },
                data: input.data
            });
        }, tag);
    },

    buildDeleteRoute(repo: PrismaDelegate, tag: string, primarykeyName = "id") {
        return RouteHandleWrapper.wrapHandle(async (input) => {
            const result = await repo.deleteMany({
                where: {
                    [primarykeyName]: {
                        in: input.keys
                    }
                },
            });
        }, tag);
    },

    buildSelectRoute(repo: PrismaDelegate, tag: string) {
        return RouteHandleWrapper.wrapHandle(async (input) => {
            const { searchby, searchvalue, orderby, orderdirection, start, count } = input;
            const result = await repo.findMany({
                where: {
                    [searchby]: {
                        contains: searchvalue
                    },
                },
                orderBy: [
                    {
                        [orderby]: orderdirection,
                    },
                ],
                skip: start,
                take: count,
            });
            return result;
        }, tag);
    },

    buildCountRoute(repo: PrismaDelegate, tag: string) {
        return RouteHandleWrapper.wrapHandle(async (input) => {
            const { searchby, searchvalue, orderby, orderdirection } = input;
            const result = await repo.count({
                where: {
                    [searchby]: {
                        contains: searchvalue
                    },
                },
                orderBy: [
                    {
                        [orderby]: orderdirection,
                    },
                ]
            });
            return result;
        }, tag);
    },

    buildCountInputParser(searchProperties: string[], orderProperties: string[], tag: string) {
        return RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && typeof input.searchby === "string"
                && typeof input.searchvalue === "string"
                && typeof input.orderby === "string"
                && typeof input.orderdirection === "string"
                && searchProperties.includes(input.searchby)
                && orderProperties.includes(input.orderby)
                && (input.orderdirection === "asc" || input.orderdirection === "desc")
            ) {
                return {
                    searchby: input.searchby,
                    searchvalue: input.searchvalue,
                    orderby: input.orderby,
                    orderdirection: input.orderdirection,
                };
            }

            return undefined;
        }, tag, InputSource.query);
    },

    buildSelectInputParser(searchProperties: string[], orderProperties: string[], tag: string) {
        return RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && typeof input.searchby === "string"
                && typeof input.searchvalue === "string"
                && typeof input.orderby === "string"
                && typeof input.orderdirection === "string"
                && searchProperties.includes(input.searchby)
                && orderProperties.includes(input.orderby)
                && (input.orderdirection === "asc" || input.orderdirection === "desc")
                && !isNaN(input.start)
                && !isNaN(input.count)
            ) {
                return {
                    searchby: input.searchby,
                    searchvalue: input.searchvalue,
                    orderby: input.orderby,
                    orderdirection: input.orderdirection,
                    start: parseInt(input.start),
                    count: parseInt(input.count),
                };
            }

            return undefined;
        }, tag, InputSource.query);
    },

    buildDeleteInputParser(tag: string, primarykeyType = "string") {
        return RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && input.keys
                && Array.isArray(input.keys)
            ) {
                const keys: any[] = input.keys;
                if (keys.every(k => typeof k === primarykeyType)) {
                    return input;
                }
            }

            return undefined;
        }, tag, InputSource.query);
    },

}

export const RouteHandleWrapper = {
    wrapCheckInput(parseFunction: (input: any) => any, tag: string, inputSource: InputSource = InputSource.body) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input = getInput(req, res, inputSource);
            const inputParsed = parseFunction(input);

            try {
                // Check input
                if (!inputParsed) {
                    res.json(buildResponseError(1, "Invalid input"));
                    return;
                }

                // Pass input to locals
                res.locals.input = inputParsed;
                next();
            }
            catch (ex: any) {
                helper.logger.errorWithTag(tag, ex);
                const {errorCode = 2, errorMsg = "Unexpected error on server"} = ex;
                res.json(buildResponseError(errorCode, errorMsg));
            }
        };
    },

    wrapHandle(handle: (input: any) => Promise<any>, tag: string, inputSource: InputSource = InputSource.locals) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input = getInput(req, res, inputSource);
            try {
                const result = await handle(input);

                res.json(buildResponseSuccess(result));
            }
            catch (ex: any) {
                helper.logger.errorWithTag(tag, ex);
                const {errorCode = 2, errorMsg = "Unexpected error on server"} = ex;
                res.json(buildResponseError(errorCode, errorMsg));
            }
        };
    }
}