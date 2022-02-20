"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const poolPromise = (0, promise_1.createPool)({
    host: 'localhost',
    user: 'doan2',
    password: 'ktpm2019',
    database: "doan2",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
function insert(tableName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let props = Object.getOwnPropertyNames(data);
        let columns = [];
        let keys = [];
        let values = [];
        props.forEach((propName) => {
            columns.push(propName);
            keys.push("?");
            values.push(data[propName]);
        });
        let sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${keys.join(',')});`;
        return poolPromise.execute(sql, values);
    });
}
function updateById(tableName, id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let props = Object.getOwnPropertyNames(data);
        let columns = [];
        let values = [];
        props.forEach((propName) => {
            columns.push(propName + "=?"); // ColumnA=?
            values.push(data[propName]);
        });
        values.push(id);
        let sql = `UPDATE ${tableName} SET ${columns.join(',')} WHERE id=?;`;
        return poolPromise.execute(sql, values);
    });
}
function deleteById(tableName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let values = [id];
        let sql = `DELETE FROM ${tableName} WHERE id=?`;
        return poolPromise.execute(sql, values);
    });
}
const db = {
    poolPromise,
    insert,
    updateById,
    deleteById,
};
exports.default = db;
