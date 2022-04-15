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
exports.AccountRepository = void 0;
const __1 = require("..");
const default_1 = require("./default");
const helper_1 = __importDefault(require("../../../helper"));
class AccountRepository extends default_1.DefaultRepository {
    insert(data, selectedFields) {
        const _super = Object.create(null, {
            insert: { get: () => super.insert }
        });
        return __awaiter(this, void 0, void 0, function* () {
            helper_1.default.logger.traceWithTag("MYSQL, INSERT", "Start: Insert account");
            selectedFields = [
                "username",
                "password",
            ];
            const result = yield _super.insert.call(this, data, selectedFields);
            const newID = result.id;
            helper_1.default.logger.traceWithTag("MYSQL, INSERT", "Success: Inserted account with id = " + newID);
            return result;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield __1.myPrisma.account.findUnique({
                where: {
                    id: id
                },
            });
            if (!result) {
                return null; // Not found
            }
            return result;
        });
    }
    /**
     *
     * @param username
     * @param password
     * @returns Return null if not found
     */
    checkLogin(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectFields = [
                "id",
                "status",
                "username",
                "password",
                "userRole"
            ];
            const result = yield __1.myPrisma.account.findFirst({
                where: {
                    username: username,
                    password: password,
                },
            });
            if (!result) {
                return null;
            }
            return result;
        });
    }
    comfirmEmail(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = (yield this.checkLogin(username, password));
            if (!account) {
                return null;
            }
            const result = yield __1.myPrisma.account.update({
                where: {
                    id: account.id
                },
                data: {
                    status: 2
                },
            });
            return result;
        });
    }
}
exports.AccountRepository = AccountRepository;
