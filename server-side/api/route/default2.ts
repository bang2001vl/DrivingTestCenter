import { Router, json } from "express";
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

    buildSelectRoute(router: Router, inputChecker: (input: any) => any, repo: PrismaDelegate, tag: string) {
        router.post("/select", json());
        router.post("/select", async (req, res) => {
            helper.logger.traceWithTag(tag, "Incoming API from " + req.ip);

            const input = req.body;
            console.log(input);

            const data = inputChecker(input);
            if (!data) {
                res.json(buildResponseError(1, "Invalid input"));
                return;
            }

            helper.logger.traceWithTag(tag, "Accepted input = " + JSON.stringify(input, null, 4));
            try {
                const { search, order, paging, filter } = data;
                const result = await repo.findMany({
                    where: {
                        [search.property]: {
                            contains: search.value
                        },
                    },
                    orderBy: [
                        {
                            [order.property]: order.direction,
                        },
                    ],
                    skip: paging.start,
                    take: paging.count,
                });
                res.json(buildResponseSuccess({
                    result
                }));
            }
            catch (ex) {
                helper.logger.errorWithTag(tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        });
        return router;
    }
}