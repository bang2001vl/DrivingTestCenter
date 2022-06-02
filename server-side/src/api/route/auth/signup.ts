import { json, Router, urlencoded } from "express";
import { sign, verify } from "jsonwebtoken";
import path from "path";
import appConfig from "../../../config";
import helper from "../../../helper";
import { buildResponseError, buildResponseSuccess } from "../utilities";
import { RouteHandleWrapper } from "../_wrapper";
import { sendConfirmEmail } from "../../../nodemailer";
import { myPrisma } from "../../../prisma";


const secretJWT = "asdjb!@#!523BD#@$";
const optionJWT = {
    issuer: "n2tb",
    audience: "thunder-server-2",
}

const PATH_SUCCESS_HTML = path.resolve(appConfig.resourceFolder, "template/success.html");

const tag = "SignUp";

export const SignupRoute = () => {
    const route = Router();
    route.use(json());
    route.use(urlencoded({ extended: true }));

    route.post("/",
        RouteHandleWrapper.wrapCheckInput(parseInput, tag),
        RouteHandleWrapper.wrapMiddleware(async (req, res) => {
            const account = res.locals.input.data;
            //console.log("Locals = " + JSON.stringify(res.locals, null, 2));

            // Check duplicate username
            const oldAccount = await myPrisma.account.findFirst({
                where: { username: account.username }
            });
            if (oldAccount) {
                throw buildResponseError(2, "Username already registered");
            }

            // Create token
            const token = sign({
                account: account
            }, secretJWT, {
                ...optionJWT,
                expiresIn: 2 * 60 * 60, // 2 hours
            })
            helper.logger.traceWithTag(tag, "Token: " + token);

            // Send verify email
            const email = account.email;
            await sendConfirmEmail(email, token);

            res.locals.responseData = buildResponseSuccess({
                message: "Please check your email to verify your account",
            });
        }, tag, true),
    );

    route.get("/verify",
        async (req, res) => {
            helper.logger.traceWithTag(tag, "Got request");
            const token = req.query.token;
            if (typeof token === "string"
            ) {
                try {
                    const decoded = verify(token, secretJWT, optionJWT);
                    if (decoded
                        && typeof decoded !== "string"
                        && decoded.account
                        && typeof decoded.account.username === "string"
                        && typeof decoded.account.password === "string"
                    ) {
                        helper.logger.traceWithTag(tag, "Decoded: " + JSON.stringify(decoded, null, 2));
                        // Check duplicate username
                        const oldAccount = await myPrisma.account.findFirst({
                            where: { username: decoded.account.username }
                        });
                        if (oldAccount) {
                            res.send("Account already verified");
                            return;
                        }

                        // Create record
                        const result = await myPrisma.account.create({
                            data: {
                                ...decoded.account,
                                status: 1
                            },
                        });
                        helper.logger.traceWithTag(tag, "Signup sucessfull with account" + JSON.stringify(decoded.account, null, 2));
                        return res.sendFile(PATH_SUCCESS_HTML);
                    }
                }
                catch (ex: any) {
                    res.status(404).send("Invalid token");
                    return;
                }
            }

            helper.logger.traceWithTag(tag, "Invalid query: " + req.query);
            res.status(404);
        },
    );

    route.get("/test",
        async (req, res) => {
            res.sendFile(PATH_SUCCESS_HTML);
        },
    );

    return route;
};


function parseInput(input: any) {
    if (input) {
        const inputAccount = parsedAccount(input.account);
        const inputUserInfo = parsedUserInfo(input.userInfo);
        if (inputAccount && inputUserInfo) {
            return {
                data: {
                    ...inputAccount,
                    ...inputUserInfo,
                }
            };
        }
    }
}

function parsedAccount(account: any) {
    if (account
        && typeof (account.username) === "string"
        && typeof (account.password) === "string"
    ) {
        return {
            username: account.username,
            password: account.password,
        };
    }
}

function parsedUserInfo(userInfo: any) {
    if (userInfo
        && typeof (userInfo.fullname) === "string"
        && typeof (userInfo.email) === "string"
        && typeof (userInfo.address) === "string"
        && !isNaN(userInfo.gender)
        && new Date(userInfo.birthday)) {
        return {
            fullname: userInfo.fullname,
            email: userInfo.email,
            address: userInfo.address,
            gender: parseInt(userInfo.gender),
            birthday: userInfo.birthday,
        };
    }
}

/// After 5 hours, delete accounts which not verified before 5 hours ago
/// Means: Account which not verified will be delete between 5-10 hours
// setInterval(() => {
//     const min = dayjs().subtract(1, "minute").toISOString();
//     cleanAccount(min);
// }, 1 * 60 * 1000);

// async function cleanAccount(minCreateAt: Date | string) {
//     const result = await myPrisma.account.deleteMany({
//         where: {
//             AND: [
//                 {
//                     status: 0
//                 },
//                 {
//                     createdAt: {
//                         lte: minCreateAt
//                     }
//                 },
//             ]
//         }
//     });
//     return result;
// }