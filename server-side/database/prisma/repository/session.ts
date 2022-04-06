import { v1 } from "uuid";
import { myPrisma } from "..";
import helper from "../../../helper";
import { DefaultRepository } from "./default";

export const USER_ROLES = {
    admin: "admin",
    guest: "guest",
}

export class SessionRepository extends DefaultRepository{    
    async createSession(accountId: number, deviceInfo: string, userRole: string){
        const token = v1();
        helper.logger.traceWithTag("MYSQL, INSERT", "Start: Insert session");
        await this.insert({
            token,
            accountId,
            deviceInfo,
            userRole,
        });
        helper.logger.traceWithTag("MYSQL, INSERT", "Success: Inserted session with token = " + token);
        return token;
    }

    async findByToken(token: string){
        const result = await myPrisma.session.findFirst({
            where: {
                token: token
            }
        });
        
        if(result){
            return result;
        }
        else{
            return undefined;
        }
    }

    async findAccountByToken(token: string){
        const row = await myPrisma.session.findFirst({
            where: {
                token: token
            },
            select: {
                account: true,
            }
        });
        if(row){
            return row.account;
        }
        else{
            return undefined;
        }
    }

    async deleteByToken(token: string){
        return this.deleteByPK(token, "token");
    }
}