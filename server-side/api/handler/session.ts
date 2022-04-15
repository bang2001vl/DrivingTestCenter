import { NextFunction, Request, Response } from "express";
import { v1 } from "uuid";
import { db } from "../../database";
import helper from "../../helper";
import { buildResponseError } from "../route/utilities";

export const ROLE_IDS = {
    admin: 1,
    student: 2,
    employee: 3,
}

export interface ISession {
    accountId: any,
    token: any,
    deviceInfo: any,
    sessionData: any,
}

const SessionHandler = {
    async sessionMiddleware(req: Request, res: Response, nxt: NextFunction) {
        const token = req.headers["token"];
        console.log("Start: Checking token");
    
        if (!token || typeof token !== "string") {
            res.status(401).send("Unathourized");
            return;
        }
    
        try {
            const session = await db.prisma.session.findFirst({
                where: {
                    token: token,
                },
            });
            if (!session) {
                res.json(buildResponseError(401, "Unathourized"));
                return;
            }
    
            helper.logger.traceWithTag("Session", "[Accepted] Got request from session = " + JSON.stringify(session));
    
            res.locals.session = session;
            nxt();
        }
        catch (ex) {
            // System crashed
            res.json(buildResponseError(500, "Server error: We catched some unexpected exception X.X"));
        }
    },

    roleChecker(roles: any[]) {
        return async (req: Request, res: Response, nxt: NextFunction) => {
            const token = req.headers["token"];
            console.log("Start: Checking token");
    
            if (!token || typeof token !== "string") {
                res.json(buildResponseError(401, "Unathourized"));
                return;
            }
    
            try {
                const session = await db.prisma.session.findFirst({
                    where: {
                        token: token,
                    },
                    include: {
                        account: {
                            select: {
                                roleId: true,
                            }
                        }
                    }
                });
                if (!session || !session.account || !roles.includes(session.account.roleId)) {
                    res.json(buildResponseError(401, "Unathourized"));
                    return;
                }
    
                helper.logger.traceWithTag("Session", "[Accepted] Got request from session = " + JSON.stringify(session));
    
                res.locals.session = session;
                nxt();
            }
            catch (ex) {
                // System crashed
                res.json(buildResponseError(500, "Server error: We catched some unexpected exception X.X"));
            }
        }
    },
    
    async createSession(accountId: any, deviceInfo: any){
        const token = v1();
            helper.logger.traceWithTag("MYSQL, INSERT", "Start: Insert session");
            const result = await db.prisma.session.create({
                data: {
                    token,
                    accountId,
                    deviceInfo,
                    sessionData: "{}"
                }
            });
            helper.logger.traceWithTag("MYSQL, INSERT", "Success: Inserted session with token = " + token);
            return result;
    }
}

export default SessionHandler;