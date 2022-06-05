import { NextFunction, Request, Response } from "express";
import { v1 } from "uuid";
import helper from "../../helper";
import { myPrisma } from "../../prisma";

const tag = "Session";
export default class SessionHandler {
    async createSession(accountId: number, deviceInfo: string, roleId: number){
        const token = v1();
        helper.logger.traceWithTag("MYSQL, INSERT", "Start: Insert session");
        const newSession = await myPrisma.session.create({
            data: {
                token: token,
                accountId: accountId,
                deviceInfo: deviceInfo,
                roleId: roleId,
            }
        });
        helper.logger.traceWithTag("MYSQL, INSERT", "Success: Inserted session with token = " + token);
        return newSession;
    }

    async destroySession(id: any){
        const result = await myPrisma.session.delete({
            where:{id: id}
        });
        return result;
    }

    static async sessionMiddleware(req: Request, res: Response, nxt: NextFunction) {
        const token = req.headers["token"];
        console.log("Start: Checking token");
    
        if (!token || typeof token !== "string") {
            res.status(401).send("Unathourized");
            return;
        }
    
        try {
            const session = await myPrisma.session.findFirst({
                where: {
                    token: token
                }
            });
            if (!session) {
                res.status(401).send("Unathourized");
                return;
            }

            helper.logger.traceWithTag("Session", "[Accepted] Got request from session = " + JSON.stringify(session));
            
            res.locals.session = session;
            nxt();
        }
        catch (ex) {
            // System crashed
            helper.logger.errorWithTag(tag, ex)
            
            res.status(500).send("Server error: We catched some unexpected exception X.X");
        }
    }

    /**
    * Middleware that only allow request with specific role pass-through
    * @param role Role that request must have
    * @returns Result middleware function
    */
   static roleChecker(roles: number[]) {
       const middlewares = [
           this.sessionMiddleware,
           (req: Request, res: Response, nxt: NextFunction) => {
               const session = res.locals.session;
               
               if (!session || !roles.includes(session.roleId)) {
                   res.status(401).send("Bad request: Higher permission required");
                   return;
               }
       
               nxt();
           }
       ]
       return middlewares;
   }
}