import { createPool, ResultSetHeader, FieldPacket } from "mysql2/promise";

const poolPromise = createPool({
    host: 'localhost',
    user: 'doan2',
    password: 'ktpm2019',
    database: "doan2",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function insert(tableName: String, data: any){
    let props = Object.getOwnPropertyNames(data);

    let columns : string[] = [];
    let keys : string[] = [];
    let values : Array<any> = [];

    props.forEach((propName) =>{
        columns.push(propName);
        keys.push("?");
        values.push(data[propName]);
    });

    let sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${keys.join(',')});`;
    return poolPromise.execute(sql, values);
}

async function updateById(tableName: String, id: any, data: any)  : Promise<[ResultSetHeader, FieldPacket[]]>{
    let props = Object.getOwnPropertyNames(data);

    let columns : string[] = [];
    let values : Array<any> = [];

    props.forEach((propName) =>{
        columns.push(propName + "=?"); // ColumnA=?
        values.push(data[propName]);
    });
    values.push(id);
    
    let sql = `UPDATE ${tableName} SET ${columns.join(',')} WHERE id=?;`;
    return poolPromise.execute(sql, values);
}

async function deleteById(tableName:String, id:any) {
    let values = [id];
    let sql = `DELETE FROM ${tableName} WHERE id=?`;
    return poolPromise.execute(sql, values);
}

const db = {
    poolPromise,
    insert,
    updateById,
    deleteById,
}

export default db;