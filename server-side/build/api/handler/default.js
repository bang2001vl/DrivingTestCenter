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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCRUDHandler = void 0;
const helper_1 = __importDefault(require("../../helper"));
class DefaultCRUDHandler {
    constructor(repo, tag) {
        this._repo = repo;
        this.tag = tag;
    }
    /**
     *
     * @param input Raw input data
     * @returns Return pk if valid. Otherwise, return undefined
     */
    checkPK(input) {
        if (input && typeof input.key !== undefined) {
            return input.keys;
        }
        // Invalid
        return undefined;
    }
    /**
     *
     * @param input Raw input data
     * @returns Return an array of pk if valid. Otherwise, return undefined
     */
    checkPKs(input) {
        if (input
            && input.keys
            && Array.isArray(input.keys)
            && input.keys.length > 0) {
            return input.keys;
        }
        // Invalid
        return undefined;
    }
    /**
     *
     * @param input Raw input data
     * @returns Return pk list if valid. Otherwise, return undefined
     */
    checkRange(input) {
        if (input && !isNaN(input.start) && !isNaN(input.count)) {
            return {
                start: Number(input.start),
                count: Number(input.count),
            };
        }
        // Invalid
        return undefined;
    }
    /**
     * Check input data and clear un-used property
     * @param input Raw input data
     * @returns Return the object that all property inside would be inserted to db
     */
    checkInsertData(input) {
        helper_1.default.logger.traceWithTag(this.tag, "Alert: Should not use default insert handler");
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
    checkUpdateData(input) {
        helper_1.default.logger.traceWithTag(this.tag, "Alert: Should not use default update handler");
        if (input && input.data && input.key) {
            return {
                data: input.data,
                key: input.key,
            };
        }
        //Invalid
        return undefined;
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repo.insert(data);
        });
    }
    selects(pks) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repo.selectByPKs(pks);
        });
    }
    selectAll(start = 0, count = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repo.rawSelectAll(start, count);
        });
    }
    update(pk, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repo.updateByPK(pk, data);
        });
    }
    deletes(pks) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repo.deleteByPKs(pks);
        });
    }
    countAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repo.countAll();
        });
    }
}
exports.DefaultCRUDHandler = DefaultCRUDHandler;
