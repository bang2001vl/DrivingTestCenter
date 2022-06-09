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
exports.NativeFlutterRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../../../prisma");
const FieldGetter_1 = require("../../handler/FieldGetter");
const _default_1 = require("../_default");
const _wrapper_1 = require("../_wrapper");
const tag = "NativeFlutter";
const NativeFlutterRoute = () => {
    const route = (0, express_1.Router)();
    route.get("/findbyauth", _wrapper_1.RouteHandleWrapper.wrapCheckInput(input => {
        return {
            username: FieldGetter_1.FieldGetter.String(input, "username", true),
            password: FieldGetter_1.FieldGetter.String(input, "password", true),
        };
    }, tag, _wrapper_1.InputSource.query), _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield prisma_1.myPrisma.account.findMany({
            where: {
                username: input.username,
                password: input.password,
            }
        });
        return account;
    }), tag));
    route.get("/findbyid", _wrapper_1.RouteHandleWrapper.wrapCheckInput(input => {
        return {
            accountId: FieldGetter_1.FieldGetter.Number(input, "accountId", true),
        };
    }, tag, _wrapper_1.InputSource.query), _wrapper_1.RouteHandleWrapper.wrapHandleInput((input) => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield prisma_1.myPrisma.account.findMany({
            where: {
                id: input.accountId,
            }
        });
        return account;
    }), tag));
    route.post("/update", _wrapper_1.RouteHandleWrapper.wrapCheckInput(input => {
        return {
            key: FieldGetter_1.FieldGetter.Number(input, "key", true),
            data: {
                latestDelete: FieldGetter_1.FieldGetter.Number(input, "latestDelete", true),
                updateTime: FieldGetter_1.FieldGetter.Number(input, "updateTime", true),
            }
        };
    }, tag, _wrapper_1.InputSource.query), _default_1.RouteBuilder.buildUpdateRoute(prisma_1.myPrisma.account, tag));
    return route;
};
exports.NativeFlutterRoute = NativeFlutterRoute;
