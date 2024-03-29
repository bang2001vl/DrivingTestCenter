import { PrismaDelegate } from "../../prisma";
import { FieldGetter } from "../handler/FieldGetter";
import { buildResponseError, checkNestedInput_Insert, InsertChecker, parseInputDeleted, parseStringToArrayId } from "./utilities";
import { InputSource, RouteHandleWrapper, WrapperErrorCallback } from "./_wrapper";

export const RouteBuilder = {
    buildInsertRoute(repo: PrismaDelegate, tag: string, inputSource = InputSource.locals, onError?: WrapperErrorCallback) {
        return RouteHandleWrapper.wrapHandleInput(async (input) => {
            const newRecord = await repo.create({
                data: input.data
            });
            return newRecord;
        }, tag, inputSource, onError);
    },

    buildInsertManyRoute(repo: PrismaDelegate, tag: string, inputSource = InputSource.locals, onError?: WrapperErrorCallback) {
        return RouteHandleWrapper.wrapHandleInput(async (input) => {
            const newRecord = await repo.createMany({
                data: input.data
            });
            return newRecord;
        }, tag, inputSource, onError);
    },

    buildUpdateRoute(repo: PrismaDelegate, tag: string, primarykeyName = "id", inputSource = InputSource.locals, onError?: WrapperErrorCallback) {
        return RouteHandleWrapper.wrapHandleInput(async (input) => {
            console.log(input);
            const updatedRecord = await repo.update({
                where: {
                    [primarykeyName]: input.key
                },
                data: input.data
            });
            return updatedRecord;
        }, tag, inputSource, onError);
    },

    buildDeletesRoute(repo: PrismaDelegate, tag: string, primarykeyName = "id", inputSource = InputSource.locals, onError?: WrapperErrorCallback) {
        return RouteHandleWrapper.wrapHandleInput(async (input) => {
            const result = await repo.deleteMany({
                where: {
                    [primarykeyName]: {
                        in: input.keys
                    }
                },
            });
            return result.count;
        }, tag, inputSource, onError);
    },

    buildDeleteSingleRoute(repo: PrismaDelegate, tag: string, primarykeyName = "id", inputSource = InputSource.locals, onError?: WrapperErrorCallback) {
        return RouteHandleWrapper.wrapHandleInput(async (input) => {
            const result = await repo.delete({
                where: {
                    [primarykeyName]: input.key
                },
            });
            return result.count;
        }, tag, inputSource, onError);
    },

    buildSelectRoute(repo: PrismaDelegate, tag: string, customFilter?: (input: any) => any, customSelect?: (input: any) => any, customInclude?: (input: any) => any) {
        return RouteHandleWrapper.wrapHandleInput(async (input) => {
            const { searchby, searchvalue, orderby, orderdirection, start, count } = input;
            const filter = customFilter ? customFilter(input) : undefined;
            const select = customSelect ? customSelect(input) : undefined;
            const include = customInclude ? customInclude(input) : undefined;

            const searchWhere = (input.searchby && input.searchvalue) ? {
                [searchby]: (!searchvalue || searchvalue === '') ? undefined : {
                    contains: searchvalue
                }
            } : undefined;

            const orderBy = (input.orderby && input.orderdirection) ? [
                {
                    [orderby]: orderdirection,
                },
            ] : undefined;

            const result = await repo.findMany({
                where: {
                    ...searchWhere,
                    ...filter
                },
                orderBy,
                skip: start,
                take: count,
                select,
                include,
            });
            console.log(result);

            return result;
        }, tag);
    },

    buildCountRoute(repo: PrismaDelegate, tag: string, customFilter?: (input: any) => any) {
        return RouteHandleWrapper.wrapHandleInput(async (input) => {
            const { searchby, searchvalue } = input;
            const filter = customFilter ? customFilter(input) : undefined;
            const result = await repo.count({
                where: {
                    [searchby]: {
                        contains: searchvalue
                    },
                    ...filter
                },
            });
            return result;
        }, tag);
    },

    buildCountInputParser(searchProperties: string[], tag: string) {
        return RouteHandleWrapper.wrapCheckInput((input) => {
            if(input.searchby && input.searchvalue){
                input.searchby = FieldGetter.String(input, "searchby", true);
                input.searchvalue = FieldGetter.String(input, "searchvalue", true);
                if(!searchProperties.includes(input.searchby)){
                    throw buildResponseError(-1, "Invalid searchby");
                }
            }

            return input;
        }, tag, InputSource.query);
    },

    buildSelectInputParser(searchProperties: string[], orderProperties: string[], tag: string) {
        const checkFunc = () => { console.log("passed"); return true };
        return RouteHandleWrapper.wrapCheckInput((input) => {
            console.log(input);
            
            if(input.searchby && input.searchvalue){
                input.searchby = FieldGetter.String(input, "searchby", true);
                input.searchvalue = FieldGetter.String(input, "searchvalue", true);
                if(!searchProperties.includes(input.searchby)){
                    throw buildResponseError(-1, "Invalid searchby");
                }
            }

            if(input.orderby && input.orderdirection){
                input.orderby = FieldGetter.String(input, "orderby", true);
                input.orderdirection = FieldGetter.String(input, "orderdirection", true);
                if(!orderProperties.includes(input.orderby)){
                    throw buildResponseError(-1, "Invalid orderby");
                }
            }

            input.start = 0 || FieldGetter.Number(input, "start");
            input.count = undefined || FieldGetter.Number(input, "count");

            return input;
        }, tag, InputSource.query);
    },

    buildKeysParser(tag: string, primarykeyType = "number", inputSource = InputSource.body) {
        return RouteHandleWrapper.wrapCheckInput((input) => {
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
                    const keys = input.keys.split(",");
                    if (primarykeyType === "number") {
                        const keys_number: any[] = [];
                        for (let i = 0; i < keys.length; i++) {
                            try {
                                keys_number.push(parseInt(keys[i]))
                            }
                            catch (ex: any) {
                                throw buildResponseError(1, "Invalid keys");
                            }
                        }
                        return {
                            keys: keys_number
                        };
                    }
                    else {
                        return {
                            keys: keys
                        };
                    }
                }
            }
        }, tag, inputSource);
    },
    buildKeyParser(tag: string, primarykeyType = "number", inputSource = InputSource.query) {
        return RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && !isNaN(input.key)
            ) {
                return {
                    ...input,
                    key: Number(input.key)
                }
            }
        }, tag, inputSource);
    },
    buildNestInsertManyCheckerRoute(nestFieldName: string, mainKey: string, checker: InsertChecker, source = InputSource.body) {
        return RouteHandleWrapper.wrapMiddleware((req, res) => {
            const input = RouteHandleWrapper.getInput(req, res, source);
            if (input[nestFieldName] && input[nestFieldName].added) {
                if (typeof input[nestFieldName] === "string") {
                    input[nestFieldName] = JSON.parse(input[nestFieldName]);
                }
                if (!Array.isArray(input[nestFieldName].added)) {
                    throw buildResponseError(1, `Invalid examTest`);
                }

                const newInsertArray = input[nestFieldName].added.map((e: any) => {
                    const checked = checkNestedInput_Insert(e, mainKey, checker);
                    if (!checked) {
                        throw buildResponseError(1, `Invalid input nested`);
                    }
                    else {
                        return checked;
                    }
                });

                res.locals.input.data = {
                    ...res.locals.input.data,
                    [nestFieldName]: {
                        createMany: {
                            data: newInsertArray,
                        }
                    }
                }
            }
        });
    },
    buildDeleteNestedData(nestFieldName: string, nestPKName: string, source = InputSource.body) {
        return RouteHandleWrapper.wrapMiddleware((req, res) => {
            const input = RouteHandleWrapper.getInput(req, res, source);
            if (input[nestFieldName] && input[nestFieldName].deleted) {
                const ids = parseInputDeleted({ keys: input[nestFieldName].deleted });
                if (!ids) {
                    throw buildResponseError(1, `Invalid input nested`);
                }

                res.locals.input.data = {
                    ...res.locals.input.data,
                    [nestFieldName]: {
                        deleteMany: {
                            [nestPKName]: {
                                in: ids
                            }
                        },
                    }
                }
            }
        });
    },
}