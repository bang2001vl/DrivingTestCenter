import { Router, json, Request, Response, NextFunction } from "express";
import { URL } from "url";
import { PrismaDelegate } from "../../database/prisma";
import helper from "../../helper";
import { buildResponseError, buildResponseSuccess } from "./utilities";

export enum InputSource {
    body, query
}

function getInput(req: Request, source: InputSource) {
    if (source === InputSource.body) {
        return req.body
    }
    if (source === InputSource.query) {
        return req.query
    }
}

export const RouteBuilder = {
    buildInsertRoute(repo: PrismaDelegate, tag: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input = res.locals.input;
            try {
                const result = await repo.create({
                    data: input.data
                });
                res.json(buildResponseSuccess());
            }
            catch (ex) {
                helper.logger.errorWithTag(tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        }
    },

    buildUpdateRoute(repo: PrismaDelegate, tag: string, primarykeyName = "id") {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input = res.locals.input;
            try {
                const result = await repo.update({
                    where: {
                        [primarykeyName]: input.key
                    },
                    data: input.data
                });
                res.json(buildResponseSuccess());
            }
            catch (ex) {
                helper.logger.errorWithTag(tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        }
    },
    buildDeleteRoute(repo: PrismaDelegate, tag: string, primarykeyName = "id") {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input = res.locals.input;
            try {
                const result = await repo.delete({
                    where: {
                        [primarykeyName]: {
                            in: input.keys
                        }
                    },
                });
                res.json(buildResponseSuccess());
            }
            catch (ex) {
                helper.logger.errorWithTag(tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        }
    },

    buildSelectRoute(repo: PrismaDelegate, tag: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input = res.locals.input;
            try {
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

                res.json(buildResponseSuccess(result));
            }
            catch (ex) {
                helper.logger.errorWithTag(tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        };
    },

    buildCountRoute(repo: PrismaDelegate, tag: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input = res.locals.input;
            try {
                const { searchby, searchvalue, orderby, orderdirection, start, count } = input;
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
                    ],
                    skip: start,
                    take: count,
                });

                res.json(buildResponseSuccess(result));
            }
            catch (ex) {
                helper.logger.errorWithTag(tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        };
    },

    buildInputParser(parseFunction: (input: any) => any, inputSource: InputSource = InputSource.body) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input = getInput(req, inputSource);
            const inputParsed = parseFunction(input);
            // Check input
            if (!inputParsed) {
                res.json(buildResponseError(1, "Invalid input"));
                return;
            }

            // Pass input to locals
            res.locals.input = inputParsed;
            next();
        };
    },

    buildCountInputParser(searchProperties: string[], orderProperties: string[], tag: string) {
        return this.buildInputParser((input) => {
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
        }, InputSource.query);
    },

    buildSelectInputParser(searchProperties: string[], orderProperties: string[], tag: string) {
        return this.buildInputParser((input) => {
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
        }, InputSource.query);
    },

    buildDeleteInputParser(primarykeyType = "string") {
        return this.buildInputParser((input) => {
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
        }, InputSource.query);
    }
}