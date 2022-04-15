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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteHandleWrapper = exports.RouteBuilder = exports.InputSource = void 0;
const helper_1 = __importDefault(require("../../helper"));
const utilities_1 = require("./utilities");
var InputSource;
(function (InputSource) {
    InputSource[InputSource["body"] = 0] = "body";
    InputSource[InputSource["query"] = 1] = "query";
    InputSource[InputSource["locals"] = 2] = "locals";
})(InputSource = exports.InputSource || (exports.InputSource = {}));
function getInput(req, res, source) {
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
exports.RouteBuilder = {
    buildInsertRoute(repo, tag) {
        return exports.RouteHandleWrapper.wrapHandle((input) => __awaiter(this, void 0, void 0, function* () {
            const result = yield repo.create({
                data: input.data
            });
        }), tag);
    },
    buildUpdateRoute(repo, tag, primarykeyName = "id") {
        return exports.RouteHandleWrapper.wrapHandle((input) => __awaiter(this, void 0, void 0, function* () {
            const result = yield repo.update({
                where: {
                    [primarykeyName]: input.key
                },
                data: input.data
            });
        }), tag);
    },
    buildDeleteRoute(repo, tag, primarykeyName = "id") {
        return exports.RouteHandleWrapper.wrapHandle((input) => __awaiter(this, void 0, void 0, function* () {
            const result = yield repo.deleteMany({
                where: {
                    [primarykeyName]: {
                        in: input.keys
                    }
                },
            });
        }), tag);
    },
    buildSelectRoute(repo, tag) {
        return exports.RouteHandleWrapper.wrapHandle((input) => __awaiter(this, void 0, void 0, function* () {
            const { searchby, searchvalue, orderby, orderdirection, start, count } = input;
            const result = yield repo.findMany({
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
        }), tag);
    },
    buildCountRoute(repo, tag) {
        return exports.RouteHandleWrapper.wrapHandle((input) => __awaiter(this, void 0, void 0, function* () {
            const { searchby, searchvalue, orderby, orderdirection } = input;
            const result = yield repo.count({
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
        }), tag);
    },
    buildCountInputParser(searchProperties, orderProperties, tag) {
        return exports.RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && typeof input.searchby === "string"
                && typeof input.searchvalue === "string"
                && typeof input.orderby === "string"
                && typeof input.orderdirection === "string"
                && searchProperties.includes(input.searchby)
                && orderProperties.includes(input.orderby)
                && (input.orderdirection === "asc" || input.orderdirection === "desc")) {
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
    buildSelectInputParser(searchProperties, orderProperties, tag) {
        return exports.RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && typeof input.searchby === "string"
                && typeof input.searchvalue === "string"
                && typeof input.orderby === "string"
                && typeof input.orderdirection === "string"
                && searchProperties.includes(input.searchby)
                && orderProperties.includes(input.orderby)
                && (input.orderdirection === "asc" || input.orderdirection === "desc")
                && !isNaN(input.start)
                && !isNaN(input.count)) {
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
    buildDeleteInputParser(tag, primarykeyType = "string") {
        return exports.RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && input.keys
                && Array.isArray(input.keys)) {
                const keys = input.keys;
                if (keys.every(k => typeof k === primarykeyType)) {
                    return input;
                }
            }
            return undefined;
        }, tag, InputSource.query);
    },
};
exports.RouteHandleWrapper = {
    wrapCheckInput(parseFunction, tag, inputSource = InputSource.body) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const input = getInput(req, res, inputSource);
            const inputParsed = parseFunction(input);
            try {
                // Check input
                if (!inputParsed) {
                    res.json((0, utilities_1.buildResponseError)(1, "Invalid input"));
                    return;
                }
                // Pass input to locals
                res.locals.input = inputParsed;
                next();
            }
            catch (ex) {
                helper_1.default.logger.errorWithTag(tag, ex);
                const { errorCode = 2, errorMsg = "Unexpected error on server" } = ex;
                res.json((0, utilities_1.buildResponseError)(errorCode, errorMsg));
            }
        });
    },
    wrapHandle(handle, tag, inputSource = InputSource.locals) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const input = getInput(req, res, inputSource);
            try {
                const result = yield handle(input);
                res.json((0, utilities_1.buildResponseSuccess)(result));
            }
            catch (ex) {
                helper_1.default.logger.errorWithTag(tag, ex);
                const { errorCode = 2, errorMsg = "Unexpected error on server" } = ex;
                res.json((0, utilities_1.buildResponseError)(errorCode, errorMsg));
            }
        });
    }
};
