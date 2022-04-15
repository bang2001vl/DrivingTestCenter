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
exports.DefaultCRUDRouteBuilder = void 0;
const express_1 = require("express");
const helper_1 = __importDefault(require("../../helper"));
const utilities_1 = require("./utilities");
class DefaultCRUDRouteBuilder {
    build(handler, options) {
        const { route = (0, express_1.Router)(), autoHandleEdit = { insert: false, update: false, delete: false }, useJSON = true, } = options;
        if (useJSON) {
            route.use((0, express_1.json)());
        }
        route.get("/list", (req, res) => __awaiter(this, void 0, void 0, function* () {
            helper_1.default.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);
            const input = req.body;
            const pks = handler.checkPKs(input);
            if (!pks) {
                res.json((0, utilities_1.buildResponseError)(1, "Invalid input"));
                return;
            }
            helper_1.default.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
            try {
                const list = yield handler.selects(pks);
                const result = list ? list : [];
                res.json((0, utilities_1.buildResponseSuccess)({
                    list: result,
                }));
            }
            catch (ex) {
                helper_1.default.logger.errorWithTag(handler.tag, ex);
                res.json((0, utilities_1.buildResponseError)(2, "Unexpected error on server"));
            }
        }));
        route.get("/range", (req, res) => __awaiter(this, void 0, void 0, function* () {
            helper_1.default.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);
            const input = req.body;
            const range = handler.checkRange(input);
            if (!range) {
                helper_1.default.logger.traceWithTag(handler.tag, "Invalid input = " + JSON.stringify(input));
                res.json((0, utilities_1.buildResponseError)(1, "Invalid input"));
                return;
            }
            helper_1.default.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
            try {
                const list = yield handler.selectAll(range.start, range.count);
                const result = list ? list : [];
                res.json((0, utilities_1.buildResponseSuccess)({
                    list: result,
                }));
            }
            catch (ex) {
                helper_1.default.logger.errorWithTag(handler.tag, ex);
                res.json((0, utilities_1.buildResponseError)(2, "Unexpected error on server"));
            }
        }));
        route.get("/count", (req, res) => __awaiter(this, void 0, void 0, function* () {
            helper_1.default.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);
            try {
                const length = yield handler.countAll();
                if (length) {
                    res.json((0, utilities_1.buildResponseSuccess)({
                        length
                    }));
                }
                else {
                    res.json((0, utilities_1.buildResponseSuccess)({
                        length: 0
                    }));
                }
            }
            catch (ex) {
                helper_1.default.logger.errorWithTag(handler.tag, ex);
                res.json((0, utilities_1.buildResponseError)(2, "Unexpected error on server"));
            }
        }));
        if (autoHandleEdit.insert) {
            route.post("/insert", (req, res) => __awaiter(this, void 0, void 0, function* () {
                helper_1.default.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);
                const input = req.body;
                console.log(input);
                const data = handler.checkInsertData(input);
                if (!data) {
                    res.json((0, utilities_1.buildResponseError)(1, "Invalid input"));
                    return;
                }
                helper_1.default.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
                try {
                    const result = yield handler.insert(data);
                    res.json((0, utilities_1.buildResponseSuccess)());
                }
                catch (ex) {
                    helper_1.default.logger.errorWithTag(handler.tag, ex);
                    res.json((0, utilities_1.buildResponseError)(2, "Unexpected error on server"));
                }
            }));
        }
        if (autoHandleEdit.update) {
            route.post("/update", (req, res) => __awaiter(this, void 0, void 0, function* () {
                helper_1.default.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);
                const input = req.body;
                const data = handler.checkUpdateData(input);
                if (!data) {
                    res.json((0, utilities_1.buildResponseError)(1, "Invalid input"));
                    return;
                }
                helper_1.default.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
                try {
                    const result = yield handler.update(data.key, data.data);
                    res.json((0, utilities_1.buildResponseSuccess)());
                }
                catch (ex) {
                    helper_1.default.logger.errorWithTag(handler.tag, ex);
                    res.json((0, utilities_1.buildResponseError)(2, "Unexpected error on server"));
                }
            }));
        }
        if (autoHandleEdit.delete) {
            route.delete("/delete", (req, res) => __awaiter(this, void 0, void 0, function* () {
                helper_1.default.logger.traceWithTag(handler.tag, "Incoming API from " + req.ip);
                const input = req.body;
                const pks = handler.checkPKs(input);
                if (!pks) {
                    res.json((0, utilities_1.buildResponseError)(1, "Invalid input"));
                    return;
                }
                helper_1.default.logger.traceWithTag(handler.tag, "Accepted input = " + JSON.stringify(input));
                try {
                    const result = yield handler.deletes(pks);
                    res.json((0, utilities_1.buildResponseSuccess)());
                }
                catch (ex) {
                    helper_1.default.logger.errorWithTag(handler.tag, ex);
                    res.json((0, utilities_1.buildResponseError)(2, "Unexpected error on server"));
                }
            }));
        }
        return route;
    }
}
exports.DefaultCRUDRouteBuilder = DefaultCRUDRouteBuilder;
