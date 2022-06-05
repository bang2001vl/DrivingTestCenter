"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMaxPk = exports.myPrisma = void 0;
const client_1 = require("@prisma/client");
exports.myPrisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
function findMaxPk(tableName, pkName = 'id') {
    return exports.myPrisma.$queryRawUnsafe(`SELECT max(${pkName}) as max FROM ${tableName};`);
}
exports.findMaxPk = findMaxPk;
