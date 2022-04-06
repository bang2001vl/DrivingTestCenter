import { json, Router } from "express";
import { db } from "../../database";
import helper from "../../helper";
import SessionHandler, { ISession } from "../handler/session";
import { buildResponseError, buildResponseSuccess } from "./utilities";

interface InputData {
    account: {
        username: string;
        password: string;
    }
    deviceInfo: string;
}

const LoginRouter = () => {
    const router = Router();
    router.use(json());

    router.post("/", async (req, res) => {
        console.log("[Access] /login with body : ");
        console.log(req.body);
        const input = req.body;
        console.log(input);
        
        let errorCode = 400, errorMsg = "Login failed";
        if (
            input
            && input.account
            && typeof input.account.username === "string"
            && typeof input.account.password === "string"
            && typeof input.deviceInfo === "string"
        ) {
            try {
                const account = await db.prisma.account.findFirst({
                    where: {
                        username: input.account.username,
                        password: input.account.password,
                    }
                });
                if (account) {
                    helper.logger.traceWithTag("Login", `Valid account with id = ${account.id}`);
                    const session = await SessionHandler.createSession(account.id, input.deviceInfo);
                    if (session) {
                        helper.logger.traceWithTag("Login", `Created new session with id = ${session.id}`);
                        res.json(buildResponseSuccess({
                            session: {
                                token: session.token,
                                roleId: account.roleId,
                            }
                        }));
                        return;
                    }
                }
            }
            catch (e) {
                console.log("Ex");
                
                helper.logger.errorWithTag("Login", e);
            }
        }

        // Failed
        res.json(buildResponseError(errorCode, errorMsg));
    });

    return router;
};

export default LoginRouter;