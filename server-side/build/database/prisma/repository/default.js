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
exports.DefaultAssociationRepository = exports.DefaultRepository = void 0;
class DefaultRepository {
    constructor(model) {
        this._model = model;
    }
    arrayToSelectObj(selectedFields) {
        if (selectedFields) {
            const select = {};
            selectedFields.forEach(f => {
                select.selectedFields = true;
            });
            return select;
        }
        else {
            return undefined;
        }
    }
    selectByPK(pk, primaryKeyName = "id", selectedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._model.findFirst({
                where: {
                    [primaryKeyName]: pk
                },
                select: this.arrayToSelectObj(selectedFields),
            });
            return result;
        });
    }
    /**
     *
     * @param data
     * @param selectedFields
     * @returns The object that has been created (included id)
     */
    insert(data, selectedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._model.create({
                data: data,
                select: this.arrayToSelectObj(selectedFields),
            });
            return result;
        });
    }
    updateByPK(pk, data, selectedFields, pkName = "id") {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._model.update({
                where: {
                    [pkName]: pk,
                },
                data: data,
                select: this.arrayToSelectObj(selectedFields),
            });
            return result;
        });
    }
    deleteByPK(pk, pkName = "id") {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._model.delete({
                where: {
                    [pkName]: pk,
                }
            });
            return result;
        });
    }
    selectByPKs(pks, selectedFields, primaryKeyName = "id") {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this._model.findMany({
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
        });
    }
    rawSelectAll(start, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this._model.findMany({
                skip: start,
                take: count,
            });
            if (!rows || rows.length < 1) {
                return null;
            }
            return rows;
        });
    }
    deleteByPKs(pks, pkName = "id") {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._model.delete({
                where: {
                    [pkName]: {
                        in: pks
                    },
                }
            });
            return result;
        });
    }
    countAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._model.count();
            return result;
        });
    }
}
exports.DefaultRepository = DefaultRepository;
class DefaultAssociationRepository {
    constructor(model, sourceKeyName, targetKeyName) {
        this.model = model;
        this.sourceKeyName = sourceKeyName;
        this.targetKeyName = targetKeyName;
    }
    asignTagets(sourceId, targetIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.asignAssociations(this.model, this.sourceKeyName, sourceId, this.targetKeyName, targetIds);
        });
    }
    addTagets(sourceId, targetIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.addAssociations(this.model, this.sourceKeyName, sourceId, this.targetKeyName, targetIds);
        });
    }
    removeTagets(sourceId, targetIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.removeAssociations(this.model, this.sourceKeyName, sourceId, this.targetKeyName, targetIds);
        });
    }
    asignAssociations(tableModel, sourceKeyName, sourceKey, targetKeyName, targetKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!targetKeys || targetKeys.length < 1)
                return;
            const oldValues = yield tableModel.findMany({
                where: {
                    [sourceKeyName]: sourceKey
                }
            }).then(result => result.map(r => r[targetKeyName]));
            const newValues = targetKeys.filter(v => !oldValues.includes(v));
            console.log(newValues);
            const deletedValues = oldValues.filter(v => !targetKeys.includes(v));
            console.log(deletedValues);
            yield this.removeAssociations(tableModel, sourceKeyName, sourceKey, targetKeyName, deletedValues);
            yield this.addAssociations(tableModel, sourceKeyName, sourceKey, targetKeyName, newValues);
        });
    }
    addAssociations(tableModel, sourceKeyName, sourceKey, targetKeyName, targetKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!targetKeys || targetKeys.length < 1)
                return;
            const dataArr = targetKeys.map(v => {
                return {
                    [sourceKeyName]: sourceKey,
                    [targetKeyName]: v,
                };
            });
            return tableModel.createMany({
                data: dataArr,
            });
        });
    }
    removeAssociations(tableModel, sourceKeyName, sourceKey, targetKeyName, targetKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            let whereOpt = {
                [sourceKeyName]: sourceKey,
            };
            if (targetKeyName && targetKeys && targetKeys.length > 0) {
                whereOpt = Object.assign(Object.assign({}, whereOpt), { [targetKeyName]: {
                        in: targetKeys
                    } });
            }
            yield tableModel.deleteMany({
                where: whereOpt
            });
        });
    }
}
exports.DefaultAssociationRepository = DefaultAssociationRepository;
