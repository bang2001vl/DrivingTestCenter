import { ResultSetHeader, FieldPacket } from "mysql2/promise";
declare function insert(tableName: String, data: any): Promise<[import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket")[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket")[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket") | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket")[] | ResultSetHeader, FieldPacket[]]>;
declare function updateById(tableName: String, id: any, data: any): Promise<[ResultSetHeader, FieldPacket[]]>;
declare function deleteById(tableName: String, id: any): Promise<[import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket")[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket")[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket") | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket")[] | ResultSetHeader, FieldPacket[]]>;
declare const db: {
    poolPromise: import("mysql2/promise").Pool;
    insert: typeof insert;
    updateById: typeof updateById;
    deleteById: typeof deleteById;
};
export default db;
