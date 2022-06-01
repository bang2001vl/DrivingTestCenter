import { randomInt } from "crypto";
import { json, query, Router, urlencoded } from "express";
import helper from "../../../helper";
import { sendResetPwdMail } from "../../../nodemailer";
import { myPrisma } from "../../../prisma";
import SessionHandler from "../../handler/session";
import { buildResponseError, buildResponseSuccess } from "../utilities";
import { RouteHandleWrapper } from "../_wrapper";
import { SessionRoute } from "./session";
import { SignupRoute } from "./signup";

const tag = "Auth";

export const AuthRoute = () => {
    const route = Router();

    route.use("/signup", SignupRoute());
    route.use("/session", SessionRoute());

    route.use(json());
    route.post("/login",
        RouteHandleWrapper.wrapCheckInput(input => {
            helper.logger.traceWithTag(tag, "Has input " + JSON.stringify(input, null, 2));
            if (
                input
                && typeof input.username === "string"
                && typeof input.password === "string"
                && typeof input.deviceInfo === "string"
            ) {
                return {
                    username: String(input.username),
                    password: String(input.password),
                    deviceInfo: String(input.deviceInfo),
                };
            }
        }, tag),
        RouteHandleWrapper.wrapHandleInput(async (input) => {
            const account = await myPrisma.account.findFirst({
                where: {
                    username: input.username,
                    password: input.password,
                }
            });
            if (account) {
                const session = await (new SessionHandler()).createSession(account.id, input.deviceInfo, account.roleId);
                return {
                    session: {
                        accountId: session.accountId,
                        token: session.token,
                        roleId: session.roleId
                    },
                    userInfo: {
                        fullname: account.fullname,
                        birthday: account.birthday,
                        address: account.address,
                        gender: account.gender,
                        avatarURI: account.avatarURI,
                        email: account.email,
                        phoneNumber: account.phoneNumber
                    }
                };
            }
            else {
                throw buildResponseError(2, "Wrong information");
            }
        }, tag)
    );

    route.post("/password/update",
        SessionHandler.sessionMiddleware,
        RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && typeof input.password === "string"
            ) {
                return input;
            }
        }, tag),
        RouteHandleWrapper.wrapMiddleware((req, res) => {
            res.locals.input = {
                ...res.locals.input,
                accountId: res.locals.session.accountId,
            }
        }, tag),
        RouteHandleWrapper.wrapHandleInput(async input => {
            const result = await myPrisma.account.update({
                where: { id: input.accountId },
                data: {
                    password: input.password,
                }
            });
            return true;
        }, tag),
    );

    route.post("/password/reset",
        RouteHandleWrapper.wrapCheckInput((input) => {
            if (input
                && typeof input.email === "string"
            ) {
                return input;
            }
        }, tag),
        RouteHandleWrapper.wrapHandleInput(async (input) => {
            const newPassword = generateRandomPassword();
            const result = await sendResetPwdMail(input.email, newPassword);
            return true;
        }, tag),
    )

    return route;
};

function generateRandomPassword() {
    const characters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLMNBVCXZ";
    const length = 8;
    const rs = [];
    for (let i = 0; i < length; i++) {
        rs.push(characters.at(randomInt(characters.length)))
    }
    return rs.join();
}