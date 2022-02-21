import { Pool, RowDataPacket } from "mysql2/promise";
import { BasicRepository } from ".";

interface Account extends RowDataPacket{
    id:number;
    createTime?: string;
    updateTime?: string;
    username?: string;
    password?: string;
}

export default class AccountRepository extends BasicRepository {
    constructor(pool: Pool){
        super(pool, "account");
    }

    async findById(id: number){
        return super.rawSelectById<Account>(id);
    }
}