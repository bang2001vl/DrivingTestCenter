import { myPrisma, PrismaDelegate } from "..";

export class DefaultRepository {
    _model: PrismaDelegate;
    constructor(model: PrismaDelegate) {
        this._model = model;
    }

    arrayToSelectObj(selectedFields?: string[]){
        if(selectedFields){
            const select : any = {};
            selectedFields.forEach(f => {
                select.selectedFields = true;
            });
            return select;
        }
        else{
            return undefined;
        }
    }

    protected async selectByPK(pk: any, primaryKeyName = "id", selectedFields?: string[]) {
        const result = await this._model.findFirst({
            where: {
                [primaryKeyName]: pk
            },
            select: this.arrayToSelectObj(selectedFields),
        });
        return result;
    }

    /**
     * 
     * @param data 
     * @param selectedFields 
     * @returns The object that has been created (included id)
     */
    public async insert(data: any, selectedFields?: string[]) {
        const result = await this._model.create({
            data: data,
            select: this.arrayToSelectObj(selectedFields),
        });
        return result;
    }

    async updateByPK(pk: any, data: any, selectedFields?: string[], pkName = "id") {
        const result = await this._model.update({
            where: {
                [pkName]: pk,
            },
            data: data,
            select: this.arrayToSelectObj(selectedFields),
        });
        return result;
    }

    async deleteByPK(pk: any, pkName = "id") {
        const result = await this._model.delete({
            where: {
                [pkName]: pk,
            }
        });
        return result;
    }

    public async selectByPKs(pks: any[], selectedFields?: string[], primaryKeyName = "id") {
        const rows = await this._model.findMany({
            where: {
                [primaryKeyName]: {
                    in: pks
                }
            },
            select: this.arrayToSelectObj(selectedFields),
        });
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows;
    }

    public async rawSelectAll(start: number, count: number) {
        const rows = await this._model.findMany({
            skip: start,
            take: count,
        });
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows;
    }

    public async deleteByPKs(pks: any[], pkName = "id") {
        const result = await this._model.delete({
            where: {
                [pkName]: {
                    in: pks
                },
            }
        });
        return result;
    }

    public async countAll() {
        const result = await this._model.count();
        return result;
    }
}

export class DefaultAssociationRepository {
    sourceKeyName: string;
    targetKeyName: string;
    model: PrismaDelegate;

    constructor(model: PrismaDelegate, sourceKeyName: string, targetKeyName: string) {
        this.model = model;
        this.sourceKeyName = sourceKeyName;
        this.targetKeyName = targetKeyName;
    }

    async asignTagets(sourceId: any, targetIds: any[]) {
        return this.asignAssociations(this.model, this.sourceKeyName, sourceId, this.targetKeyName, targetIds);
    }
    async addTagets(sourceId: any, targetIds: any[]) {
        return this.addAssociations(this.model, this.sourceKeyName, sourceId, this.targetKeyName, targetIds);
    }
    async removeTagets(sourceId: any, targetIds?: any[]) {
        return this.removeAssociations(this.model, this.sourceKeyName, sourceId, this.targetKeyName, targetIds);
    }

    async asignAssociations(tableModel: PrismaDelegate, sourceKeyName: string, sourceKey: any, targetKeyName: string, targetKeys: any[]) {
        if (!targetKeys || targetKeys.length < 1) return;

        const oldValues = await tableModel.findMany({
            where: {
                [sourceKeyName]: sourceKey
            }
        }).then(result => result.map(r => r[targetKeyName]));

        const newValues = targetKeys.filter(v => !oldValues.includes(v));
        console.log(newValues);
        
        const deletedValues = oldValues.filter(v => !targetKeys.includes(v));
        console.log(deletedValues);
        

        await this.removeAssociations(tableModel, sourceKeyName, sourceKey, targetKeyName, deletedValues);
        await this.addAssociations(tableModel, sourceKeyName, sourceKey, targetKeyName, newValues);
    }

    async addAssociations(tableModel: PrismaDelegate, sourceKeyName: string, sourceKey: any, targetKeyName: string, targetKeys: any[]) {
        if (!targetKeys || targetKeys.length < 1) return;
        const dataArr: any[] = targetKeys.map(v => {
            return {
                [sourceKeyName]: sourceKey,
                [targetKeyName]: v,
            }
        });
        return tableModel.createMany({
            data: dataArr,
        });
    }
    async removeAssociations(tableModel: PrismaDelegate, sourceKeyName: string, sourceKey: any, targetKeyName?: string, targetKeys?: any[]) {
        let whereOpt: any = {
            [sourceKeyName]: sourceKey,
        }

        if(targetKeyName && targetKeys && targetKeys.length > 0){
            whereOpt = {
                ...whereOpt,
                [targetKeyName]:{
                    in: targetKeys
                }
            }
        }

        await tableModel.deleteMany({
            where: whereOpt
        });
    }
}