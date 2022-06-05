import { findMaxPk } from "../prisma";

export class IdConfig {
    maxId: {[tablename: string]: number};
    tableNames: string[];

    constructor(tableNames: string[]) {
        this.maxId = {};
        this.tableNames = tableNames;
    }

    loadFromDB() {
        this.tableNames.forEach(e => {
            findMaxPk(e)
                .then((r: any) => {
                    this.maxId[e] = r[0].max;
                });
        })
    }

    increase(tableName: string){
        if(!this.maxId[tableName]){
            return;
        }

        this.maxId[tableName]++;
    }
}