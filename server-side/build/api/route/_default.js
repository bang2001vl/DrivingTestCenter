"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteBuilder = void 0;
const FieldGetter_1 = require("../handler/FieldGetter");
const utilities_1 = require("./utilities");
const _wrapper_1 = require("./_wrapper");
exports.RouteBuilder = {
    buildInsertRoute(repo, tag, inputSource = _wrapper_1.InputSource.locals, onError) {
        return _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
            const newRecord = yield repo.create({
                data: input.data
            });
            return newRecord;
        }), tag, inputSource, onError);
    },
    buildInsertManyRoute(repo, tag, inputSource = _wrapper_1.InputSource.locals, onError) {
        return _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
            const newRecord = yield repo.createMany({
                data: input.data
            });
            return newRecord;
        }), tag, inputSource, onError);
    },
    buildUpdateRoute(repo, tag, primarykeyName = "id", inputSource = _wrapper_1.InputSource.locals, onError) {
        return _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
            console.log(input);
            const updatedRecord = yield repo.update({
                where: {
                    [primarykeyName]: input.key
                },
                data: input.data
            });
            return updatedRecord;
        }), tag, inputSource, onError);
    },
    buildDeletesRoute(repo, tag, primarykeyName = "id", inputSource = _wrapper_1.InputSource.locals, onError) {
        return _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
            const result = yield repo.deleteMany({
                where: {
                    [primarykeyName]: {
                        in: input.keys
                    }
                },
            });
            return result.count;
        }), tag, inputSource, onError);
    },
    buildDeleteSingleRoute(repo, tag, primarykeyName = "id", inputSource = _wrapper_1.InputSource.locals, onError) {
        return _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
            const result = yield repo.delete({
                where: {
                    [primarykeyName]: input.key
                },
            });
            return result.count;
        }), tag, inputSource, onError);
    },
    buildSelectRoute(repo, tag, customFilter, customSelect, customInclude) {
        return _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
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
            const result = yield repo.findMany({
                where: Object.assign(Object.assign({}, searchWhere), filter),
                orderBy,
                skip: start,
                take: count,
                select,
                include,
            });
            console.log(result);
            return result;
        }), tag);
    },
    buildCountRoute(repo, tag, customFilter) {
        return _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(this, void 0, void 0, function* () {
            const { searchby, searchvalue } = input;
            const filter = customFilter ? customFilter(input) : undefined;
            const result = yield repo.count({
                where: Object.assign({ [searchby]: {
                        contains: searchvalue
                    } }, filter),
            });
            return result;
        }), tag);
    },
    buildCountInputParser(searchProperties, tag) {
        return _wrapper_1.RouteHandleWrapper.wrapCheckInput((input) => {
            if (input.searchby && input.searchvalue) {
                input.searchby = FieldGetter_1.FieldGetter.String(input, "searchby", true);
                input.searchvalue = FieldGetter_1.FieldGetter.String(input, "searchvalue", true);
                if (!searchProperties.includes(input.searchby)) {
                    throw (0, utilities_1.buildResponseError)(-1, "Invalid searchby");
                }
            }
            return input;
        }, tag, _wrapper_1.InputSource.query);
    },
    buildSelectInputParser(searchProperties, orderProperties, tag) {
        const checkFunc = () => { console.log("passed"); return true; };
        return _wrapper_1.RouteHandleWrapper.wrapCheckInput((input) => {
            console.log(input);
            if (input.searchby && input.searchvalue) {
                input.searchby = FieldGetter_1.FieldGetter.String(input, "searchby", true);
                input.searchvalue = FieldGetter_1.FieldGetter.String(input, "searchvalue", true);
                if (!searchProperties.includes(input.searchby)) {
                    throw (0, utilities_1.buildResponseError)(-1, "Invalid searchby");
                }
            }
            if (input.orderby && input.orderdirection) {
                input.orderby = FieldGetter_1.FieldGetter.String(input, "orderby", true);
                input.orderdirection = FieldGetter_1.FieldGetter.String(input, "orderdirection", true);
                if (!orderProperties.includes(input.orderby)) {
                    throw (0, utilities_1.buildResponseError)(-1, "Invalid orderby");
                }
            }
            input.start = 0 || FieldGetter_1.FieldGetter.Number(input, "start");
            input.count = undefined || FieldGetter_1.FieldGetter.Number(input, "count");
            return input;
        }, tag, _wrapper_1.InputSource.query);
    },
    buildKeysParser(tag, primarykeyType = "number", inputSource = _wrapper_1.InputSource.body) {
        return _wrapper_1.RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && input.keys) {
                if (Array.isArray(input.keys)) {
                    const keys = input.keys;
                    if (keys.every(k => typeof k === primarykeyType)) {
                        return input;
                    }
                }
                if (typeof input.keys === "string") {
                    const keys = input.keys.split(",");
                    if (primarykeyType === "number") {
                        const keys_number = [];
                        for (let i = 0; i < keys.length; i++) {
                            try {
                                keys_number.push(parseInt(keys[i]));
                            }
                            catch (ex) {
                                throw (0, utilities_1.buildResponseError)(1, "Invalid keys");
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
    buildKeyParser(tag, primarykeyType = "number", inputSource = _wrapper_1.InputSource.query) {
        return _wrapper_1.RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && !isNaN(input.key)) {
                return Object.assign(Object.assign({}, input), { key: Number(input.key) });
            }
        }, tag, inputSource);
    },
    buildNestInsertManyCheckerRoute(nestFieldName, mainKey, checker, source = _wrapper_1.InputSource.body) {
        return _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => {
            const input = _wrapper_1.RouteHandleWrapper.getInput(req, res, source);
            if (input[nestFieldName] && input[nestFieldName].added) {
                if (typeof input[nestFieldName] === "string") {
                    input[nestFieldName] = JSON.parse(input[nestFieldName]);
                }
                if (!Array.isArray(input[nestFieldName].added)) {
                    throw (0, utilities_1.buildResponseError)(1, `Invalid examTest`);
                }
                const newInsertArray = input[nestFieldName].added.map((e) => {
                    const checked = (0, utilities_1.checkNestedInput_Insert)(e, mainKey, checker);
                    if (!checked) {
                        throw (0, utilities_1.buildResponseError)(1, `Invalid input nested`);
                    }
                    else {
                        return checked;
                    }
                });
                res.locals.input.data = Object.assign(Object.assign({}, res.locals.input.data), { [nestFieldName]: {
                        createMany: {
                            data: newInsertArray,
                        }
                    } });
            }
        });
    },
    buildDeleteNestedData(nestFieldName, nestPKName, source = _wrapper_1.InputSource.body) {
        return _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => {
            const input = _wrapper_1.RouteHandleWrapper.getInput(req, res, source);
            if (input[nestFieldName] && input[nestFieldName].deleted) {
                const ids = (0, utilities_1.parseInputDeleted)({ keys: input[nestFieldName].deleted });
                if (!ids) {
                    throw (0, utilities_1.buildResponseError)(1, `Invalid input nested`);
                }
                res.locals.input.data = Object.assign(Object.assign({}, res.locals.input.data), { [nestFieldName]: {
                        deleteMany: {
                            [nestPKName]: {
                                in: ids
                            }
                        },
                    } });
            }
        });
    },
};
