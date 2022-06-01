import { json, query, Router, urlencoded } from "express";
import helper from "../../../helper";
import { myPrisma } from "../../../prisma";
import SessionHandler from "../../handler/session";
import { buildResponseError, buildResponseSuccess } from "../utilities";
import { RouteHandleWrapper } from "../_wrapper";

const tag = "Session";

export const SessionRoute = () => {
    const route = Router();
    route.use(json());

    route.get("/list",
        SessionHandler.sessionMiddleware,
        RouteHandleWrapper.wrapMiddleware(async (req, res) => {
            //helper.logger.traceWithTag(tag, JSON.stringify(res.locals.session, null, 2));
            const accountId = res.locals.session.accountId;
            const sessions = await myPrisma.session.findMany({
                where: { accountId: accountId },
                select: {
                    id: true,
                    deviceInfo: true,
                }
            });
            res.json(buildResponseSuccess(sessions));
        }),
    );
    
    route.post("/destroy/",
        SessionHandler.sessionMiddleware,
        RouteHandleWrapper.wrapCheckInput(input =>{
            if(input
                && !isNaN(Number(input.id))){
                    return {
                        id: Number(input.id)
                    }
                }
        }, tag),
        RouteHandleWrapper.wrapMiddleware(async (req, res) => {
            const id = res.locals.input.id;
            if(!id){
                throw buildResponseError(1, "Invalid input");
            }

            const target = await myPrisma.session.findUnique({
                where: {id: id}
            });

            if(!target){
                throw buildResponseError(2, "Session not founded");
            }

            if(target.accountId !== res.locals.session.accountId){
                throw buildResponseError(3, "No permisson");
            }
            
            const result = await (new SessionHandler()).destroySession(id);
            res.json(buildResponseSuccess(result));
            helper.logger.traceWithTag(tag, "Successfully destroy sessionId=" + id + " by token=" + req.headers["token"]);
        })
    );

    route.post("/destroy/self",
        SessionHandler.sessionMiddleware,
        RouteHandleWrapper.wrapMiddleware(async (req, res) => {
            const id = res.locals.session.id;
            const result = await (new SessionHandler()).destroySession(id);
            res.json(buildResponseSuccess());
            helper.logger.traceWithTag(tag, "Successfully destroy sessionId=" + id + " by token=" + req.headers["token"]);
        })
    );

    return route;
};