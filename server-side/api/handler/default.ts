import { isNumberObject } from "util/types";
import { PrismaDelegate } from "../../database/prisma";
import { DefaultRepository } from "../../database/prisma/repository/default";
import helper from "../../helper";

export class DefaultCRUDHandler {
    protected _repo: DefaultRepository;
    tag: string;
    constructor(repo: DefaultRepository, tag: string) {
        this._repo = repo;
        this.tag = tag;
    }

    /**
     * 
     * @param input Raw input data
     * @returns Return pk if valid. Otherwise, return undefined
     */
    checkPK(input: any) {
        if (input && typeof input.key !== undefined) {
            return input.keys;
        }

        // Invalid
        return undefined
    }

    /**
     * 
     * @param input Raw input data
     * @returns Return an array of pk if valid. Otherwise, return undefined
     */
    checkPKs(input: any) {
        if (
            input
            && input.keys
            && Array.isArray(input.keys)
            && input.keys.length > 0) {
            return input.keys;
        }

        // Invalid
        return undefined
    }
    
    /**
     * 
     * @param input Raw input data
     * @returns Return pk list if valid. Otherwise, return undefined
     */
    checkRange(input: any) {        
        if (input && !isNaN(input.start) && !isNaN(input.count)) {
            return {
                start: Number(input.start),
                count: Number(input.count),
            };
        }

        // Invalid
        return undefined
    }
    /**
     * Check input data and clear un-used property
     * @param input Raw input data
     * @returns Return the object that all property inside would be inserted to db
     */
    checkInsertData(input: any) {
        helper.logger.traceWithTag(this.tag, "Alert: Should not use default insert handler");
        if (input && input.data) {
            return input.data;
        }
        //Invalid
        return undefined;
    }
    /**
     * Check input data and clear un-used property
     * @param input Raw input data
     * @returns Return the object include 'key' and 'data'. All property of 'data' inside would be inserted to db where primary key match 'key'
     */
    checkUpdateData(input: any) {
        helper.logger.traceWithTag(this.tag, "Alert: Should not use default update handler");
        if (input && input.data && input.key) {
            return {
                data: input.data,
                key: input.key,
            };
        }
        //Invalid
        return undefined;
    }
    async insert(data: any) {
        return this._repo.insert(data);
    }
    async selects(pks: any[]) {
        return this._repo.selectByPKs(pks);
    }
    async selectAll(start: number = 0, count: number = 1000) {
        return this._repo.rawSelectAll(start, count);
    }
    async update(pk: any, data: any) {
        return this._repo.updateByPK(pk, data);
    }
    async deletes(pks: any[]) {
        return this._repo.deleteByPKs(pks);
    }
    async countAll(){
        return this._repo.countAll();
    }
}