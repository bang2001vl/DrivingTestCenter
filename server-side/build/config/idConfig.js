"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdConfig = void 0;
const prisma_1 = require("../prisma");
class IdConfig {
    constructor(tableNames) {
        this.maxId = {};
        this.tableNames = tableNames;
    }
    loadFromDB() {
        this.tableNames.forEach(e => {
            (0, prisma_1.findMaxPk)(e)
                .then((r) => {
                this.maxId[e] = r[0].max;
            });
        });
    }
    increase(tableName) {
        if (!this.maxId[tableName]) {
            return;
        }
        this.maxId[tableName]++;
    }
}
exports.IdConfig = IdConfig;
