import { Router, json, Request, Response, NextFunction } from "express";
import { URL } from "url";
import { PrismaDelegate } from "../../database/prisma";
import helper from "../../helper";
import { buildResponseError, buildResponseSuccess } from "./utilities";

export const RouteBuilder = {
    buildInsertRoute(router: Router, inputChecker: (input: any) => any, repo: PrismaDelegate, tag: string) {
        router.post("/insert", json());
        router.post("/insert", async (req, res) => {
            helper.logger.traceWithTag(tag, "Incoming API from " + req.ip);

            const input = req.body;
            console.log(input);

            const data = inputChecker(input);
            if (!data) {
                res.json(buildResponseError(1, "Invalid input"));
                return;
            }

            helper.logger.traceWithTag(tag, "Accepted input = " + JSON.stringify(input));
            try {
                const result = await repo.create({
                    data: data
                });
                res.json(buildResponseSuccess());
            }
            catch (ex) {
                helper.logger.errorWithTag(tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        });
        return router;
    },

    buildSelectChecker(searchProperties: string[], orderProperties: string[], tag: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input: any = req.query;
            // Check input
            if (!(input
                && typeof input.searchby === "string"
                && typeof input.searchvalue === "string"
                && typeof input.orderby === "string"
                && typeof input.orderdirection === "string"
                && searchProperties.includes(input.searchby)
                && orderProperties.includes(input.orderby)
                && (input.orderdirection === "asc" || input.orderdirection === "desc")
                && !isNaN(input.start)
                && !isNaN(input.count)
            )) {
                res.json(buildResponseError(1, "Invalid input"));
                return;
            }

            // Pass input to locals
            res.locals.input = {
                searchby: input.searchby,
                searchvalue: input.searchvalue,
                orderby: input.orderby,
                orderdirection: input.orderdirection,
                start: parseInt(input.start),
                count: parseInt(input.count),
            };
            next();
        };
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

    buildCountChecker(searchProperties: string[], orderProperties: string[], tag: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input: any = req.query;
            // Check input
            if (!(input
                && typeof input.searchby === "string"
                && typeof input.searchvalue === "string"
                && typeof input.orderby === "string"
                && typeof input.orderdirection === "string"
                && searchProperties.includes(input.searchby)
                && orderProperties.includes(input.orderby)
                && (input.orderdirection === "asc" || input.orderdirection === "desc")
            )) {
                res.json(buildResponseError(1, "Invalid input"));
                return;
            }

            // Pass input to locals
            res.locals.input = {
                searchby: input.searchby,
                searchvalue: input.searchvalue,
                orderby: input.orderby,
                orderdirection: input.orderdirection,
            };
            next();
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
    }
}