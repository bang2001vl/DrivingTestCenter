import { Router } from "express";
import { db } from "../../database";
import helper from "../../helper";
import SessionHandler, { ISession } from "../handler/session";
import { buildResponseError, buildResponseSuccess } from "./utilities";

const AccountRouter = () => {
    const router = Router();

    router.get("/detail", SessionHandler.sessionMiddleware);
    router.get("/detail", async (req, res) => {
        console.log("[Access] /account/detail with body : ");
        console.log(req.body);
        
        try {
            const session: ISession = res.locals.session;
            const result = await db.prisma.account.findUnique({
                where: {
                    id: session.accountId
                },
                select: {
                    student: true,
                    employee: true,
                }
            });
            if (result) {
                res.json(buildResponseSuccess({ ...result }));
                return;
            }
        }
        catch (e) {
            helper.logger.errorWithTag("Account", e);
        }
        res.json(buildResponseError(400, ""));
    });

    return router;
};

export default AccountRouter;