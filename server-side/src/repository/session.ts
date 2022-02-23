import { Pool, RowDataPacket } from "mysql2/promise";
import { BasicRepository } from ".";
import * as uuid from "uuid";
import { SessionData, SessionModel } from "../model/session";
import helper from "../helper";
import { config } from "process";
import appConfig from "../config";

export default class SessionRepository extends BasicRepository {
    constructor(pool: Pool) {
        super(pool, "account");
    }

    async findById(id: number) {
        const row = await this.rawSelectById(id);
        if (!row) {
            return null; // Not found
        }
        return SessionModel.fromJSON(row);
    }

    async findByToken(token: number[]){
        const sql = `SELECT * FROM ${this.tableName} WHERE token=?`;
        const reader = await this.pool.query<RowDataPacket[]>(sql, [token]);

        if(!reader || reader[0].length !== 1){ 
            return null; // Not found
        }
        
        const rows = reader[0]
        return SessionModel.fromJSON(rows[0]);
    }

    async createSession(accountId: number, deviceInfo: JSON){
        let token = helper.uuid.createToken();

        // Prevent from duplicate token
        let old = await this.findByToken(token);
        while(old !== null){
            // Log
            helper.logger.errorWithTag("[ERROR][MySQL][CreateSession]", "Has encounter uuid duplicated error");

            // Create new one
            token = helper.uuid.createToken();
            old = await this.findByToken(token);
        }

        const timeStamp = helper.time.convertToString(new Date());

        const sessionData : SessionData = {
            accountId: accountId,
            createTime: timeStamp,
            updateTime: timeStamp,
            deviceInfo,
            warnTime: 0
        }

        return this.insert(new SessionModel({
            token,
            data: JSON.stringify(sessionData),
        }, ));
    }

    async validToken(token: number[]){
        const session = await this.findByToken(token);
        if(session === null){
            helper.logger.traceWithTag("[FAILED][MySQL][ValidToken]", "Cannot found token" + JSON.stringify(token));
            throw {msg: "Invalid token"};
        }

        const data = session.receiveData();
        if((new Date()).getTime() - (new Date(data.updateTime)).getTime() > appConfig.tokenDuration){
            helper.logger.traceWithTag("[EXPIRED][Session]", "Session exprired with last access = " + data.updateTime);
            return null;
        }

        return session;
    }
}