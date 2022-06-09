import { Router } from "express"
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import { RouteBuilder } from "../_default";
import { InputSource, RouteHandleWrapper } from "../_wrapper";

const tag = "NativeFlutter";
export const NativeFlutterRoute = () => {
    const route = Router();

    route.get("/findbyauth",
        RouteHandleWrapper.wrapCheckInput(input => {
            return {
                username: FieldGetter.String(input, "username", true),
                password: FieldGetter.String(input, "password", true),
            }
        }, tag, InputSource.query),
        RouteHandleWrapper.wrapHandleInput(async input => {
            const account = await myPrisma.account.findMany({
                where: {
                    username: input.username,
                    password: input.password,
                }
            });
            return account;
        }, tag),
    );

    route.get("/findbyid",
        RouteHandleWrapper.wrapCheckInput(input => {
            return {
                accountId: FieldGetter.Number(input, "accountId", true),
            }
        }, tag, InputSource.query),
        RouteHandleWrapper.wrapHandleInput(async input => {
            const account = await myPrisma.account.findMany({
                where: {
                    id: input.accountId,
                }
            });
            return account;
        }, tag),
    );

    route.post("/update",
        RouteHandleWrapper.wrapCheckInput(input => {
            return {
                key: FieldGetter.Number(input, "key", true),
                data: {
                    latestDelete: FieldGetter.Number(input, "latestDelete", true),
                    updateTime: FieldGetter.Number(input, "updateTime", true),
                }
            }
        }, tag, InputSource.query),
        RouteBuilder.buildUpdateRoute(myPrisma.account, tag),
    );

    return route;
}