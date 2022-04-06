import { json, NextFunction, RequestHandler, Response, Router } from "express";
import { resourceLimits } from "worker_threads";
import helper from "../../helper";
import { DefaultCRUDHandler } from "../handler/default";
import { buildResponseError, buildResponseSuccess } from "./utilities";

interface IBuiderOptions {
    autoHandleEdit?: {
        insert?: boolean;
        delete?: boolean;
        update?: boolean;
    };
    useJSON?: boolean;
    route?: Router;
}

export class DefaultCRUDRouteBuilder {
    build(handler: DefaultCRUDHandler, options: IBuiderOptions) {
        const {
            route = Router(),
            autoHandleEdit = { insert: false, update: false, delete: false },
            useJSON = true,
        } = options;

        if (useJSON) {
            route.use(json());
        }

        route.get("/list", async (req, res) => {
            helper.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);

            const input = req.body;
            const pks = handler.checkPKs(input);
            if (!pks) {
                res.json(buildResponseError(1, "Invalid input"));
                return;
            }

            helper.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
            try {
                const list = await handler.selects(pks);
                const result = list ? list : [];
                res.json(buildResponseSuccess({
                    list: result,
                }));
            }
            catch (ex) {
                helper.logger.errorWithTag(handler.tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        });

        route.get("/range", async (req, res) => {
            helper.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);

            const input = req.body;
            const range = handler.checkRange(input);
            if (!range) {
                helper.logger.traceWithTag(handler.tag, "Invalid input = " + JSON.stringify(input));
                res.json(buildResponseError(1, "Invalid input"));
                return;
            }

            helper.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
            try {
                const list = await handler.selectAll(range.start, range.count);
                const result = list ? list : [];
                res.json(buildResponseSuccess({
                    list: result,
                }));
            }
            catch (ex) {
                helper.logger.errorWithTag(handler.tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        });

        route.get("/count", async (req, res) => {
            helper.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);

            try {
                const length = await handler.countAll();
                if (length) {
                    res.json(buildResponseSuccess({
                        length
                    }));
                }
                else {
                    res.json(buildResponseSuccess({
                        length: 0
                    }));
                }
            }
            catch (ex) {
                helper.logger.errorWithTag(handler.tag, ex);
                res.json(buildResponseError(2, "Unexpected error on server"));
            }
        });

        if (autoHandleEdit.insert) {
            route.post("/insert", async (req, res) => {
                helper.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);

                const input = req.body;
                console.log(input);
                
                const data = handler.checkInsertData(input);
                if (!data) {
                    res.json(buildResponseError(1, "Invalid input"));
                    return;
                }

                helper.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
                try {
                    const result = await handler.insert(data);
                    res.json(buildResponseSuccess());
                }
                catch (ex) {                    
                    helper.logger.errorWithTag(handler.tag, ex);
                    res.json(buildResponseError(2, "Unexpected error on server"));
                }
            });
        }

        if (autoHandleEdit.update) {
            route.post("/update", async (req, res) => {
                helper.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);

                const input = req.body;
                const data = handler.checkUpdateData(input);
                if (!data) {
                    res.json(buildResponseError(1, "Invalid input"));
                    return;
                }

                helper.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
                try {
                    const result = await handler.update(data.key, data.data);
                    res.json(buildResponseSuccess());
                }
                catch (ex) {
                    helper.logger.errorWithTag(handler.tag, ex);
                    res.json(buildResponseError(2, "Unexpected error on server"));
                }
            });
        }

        if (autoHandleEdit.delete) {
            route.delete("/delete", async (req, res) => {
                helper.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);

                const input = req.body;
                const pks = handler.checkPKs(input);
                if (!pks) {
                    res.json(buildResponseError(1, "Invalid input"));
                    return;
                }

                helper.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
                try {
                    const result = await handler.deletes(pks);
                    res.json(buildResponseSuccess());
                }
                catch (ex) {
                    helper.logger.errorWithTag(handler.tag, ex);
                    res.json(buildResponseError(2, "Unexpected error on server"));
                }
            });
        }
        return route;
    }
}