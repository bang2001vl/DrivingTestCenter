import { Request, Response, NextFunction } from "express";
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

export const RouteHandleWrapper = {
    /**
     * 
     * @param parseFunction 
     * @param tag 
     * @param inputSource Default is InputSource.body
     * @returns 
     */
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

    /**
     * Wrap a handle function to a middleware with input from inputsource
     * @param handle 
     * @param tag 
     * @param inputSource Default is InputSource.locals
     * @returns 
     */
    wrapHandle(handle: (input: any) => Promise<any>, tag: string, inputSource: InputSource = InputSource.locals) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const input = getInput(req, res, inputSource);
            try {
                const result = await handle(input);
                res.locals.responseData = buildResponseSuccess(result); 
                next();
            }
            catch (ex: any) {
                helper.logger.errorWithTag(tag, ex);
                const {errorCode = 2, errorMsg = "Unexpected error on server"} = ex;
                res.json(buildResponseError(errorCode, errorMsg));
            }
        };
    }
}