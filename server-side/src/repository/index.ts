import { createPool, ResultSetHeader, FieldPacket, Pool, RowDataPacket } from "mysql2/promise";
import helper from "../helper";
import AccountRepository from "./account";

export class BasicRepository{
    pool: Pool;
    tableName: string;
    constructor(pool: Pool, tableName: string){
        this.pool = pool;
        this.tableName = tableName;
    }

    protected async rawSelectById(id: number | string){
        const sql = `SELECT * FROM ${this.tableName} WHERE id=?`;
        const reader = await this.pool.query<RowDataPacket[]>(sql, [id]);
        if(reader !== undefined && reader[0].length === 1){
            const rows = reader[0]
            return rows[0];
        }
        return null;
    }

    async insert(data: any, selectedFields?: string[]){
        const props = Object.getOwnPropertyNames(data);
    
        const columns : string[] = [];
        const keys : string[] = [];
        const values : Array<any> = [];
    
        props.forEach((propName) => {
            if(selectedFields && selectedFields.indexOf(propName) < 0){
                return; // Exclude property if not being selected
            }

            columns.push(propName);
            keys.push("?");
            values.push(data[propName]);
        });
    
        const sql = `INSERT INTO ${this.tableName} (${columns.join(',')}) VALUES (${keys.join(',')});`;
        return this.pool.execute(sql, values);
    }
    
    async updateById(id: any, data: any, selectedFields?: string[])  : Promise<[ResultSetHeader, FieldPacket[]]>{
        const props = Object.getOwnPropertyNames(data);
    
        const columns : string[] = [];
        const values : Array<any> = [];
    
        props.forEach((propName) =>{
            if(selectedFields && selectedFields.indexOf(propName) < 0){
                return; // Exclude property if not being selected
            }
            columns.push(propName + "=?"); // ColumnA=?
            values.push(data[propName]);
        });
        values.push(id);
        
        const sql = `UPDATE ${this.tableName} SET ${columns.join(',')} WHERE id=?;`;
        return this.pool.execute(sql, values);
    }
    
    async deleteById(id:any) {
        const values = [id];
        const sql = `DELETE FROM ${this.tableName} WHERE id=?`;
        return this.pool.execute(sql, values);
    }
}

const poolPromise = createPool({
    host: 'localhost',
    user: 'doan2',
    password: 'ktpm2019',
    database: "doan2",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
});



const repository = {
    account : new AccountRepository(poolPromise),
}

export default repository;