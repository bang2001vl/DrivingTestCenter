import { Pool, RowDataPacket} from "mysql2/promise";
import { BasicRepository } from ".";
import AccountModel from "../model/account";

export default class AccountRepository extends BasicRepository {
    constructor(pool: Pool){
        super(pool, "account");
    }

    async findById(id: number){
        const row = await this.rawSelectById(id);
        if (!row) {
            return null; // Not found
        }
        return AccountModel.fromJSON(row);
    }

    /**
     * 
     * @param username 
     * @param password 
     * @returns Return null if not found
     */
    async checkLogin(username: string, password: string) {
        const sql = `SELECT * FROM ${this.tableName} WHERE username=? AND passwork=?`;
        const reader = await this.pool.query<RowDataPacket[]>(sql, [username, password]);

        if(!reader || reader[0].length !== 1){ 
            return null; // Not found
        }
        
        const rows = reader[0]
        return AccountModel.fromJSON(rows[0]);
    }

}