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
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../../config"));
const database_1 = require("../../database");
const helper_1 = __importDefault(require("../../helper"));
const nodemailer_1 = __importDefault(require("../../nodemailer"));
const secretJWT = "asdjb!@#!523BD#@$";
const optionJWT = {
    issuer: "n2tb",
    audience: "thunder-server-2",
};
const mailer = new nodemailer_1.default();
class SignUpHandler {
    validInput(data) {
        return (data
            && data.account
            && data.userInfo
            && typeof (data.account.username) === "string"
            && typeof (data.account.password) === "string"
            && typeof (data.userInfo.fullname) === "string"
            && typeof (data.userInfo.email) === "string"
            // && typeof (data.userInfo.phone) === "string"
            && typeof (data.userInfo.gender) === "number"
            && typeof (data.userInfo.address) === "string"
        //&& typeof (data.userInfo.avatarPath) === "string"
        );
    }
    validInput_Confirm(data) {
        return (typeof (data.token === "string"));
    }
    signupStudent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield database_1.db.repository.account.insert(data.account);
            // Set accountId
            data.studentData.accountId = account.id;
            const student = yield database_1.db.repository.student.insert(data.studentData);
            //helper.logger.traceWithTag("[INSERTED][UserInfo]", JSON.stringify(student));
        });
    }
    sendVerifyEmail(account, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, jsonwebtoken_1.sign)({
                account: {
                    username: account.username,
                    password: account.password,
                }
            }, secretJWT, Object.assign(Object.assign({}, optionJWT), { expiresIn: 48 * 60 * 60 }));
            const link = `${config_1.default.domain}/signup/verify?token=${token}`;
            const receiver = {
                email: info.email,
                fullname: info.fullname,
            };
            yield mailer.sendConfirmEmail(receiver.email, link);
        });
    }
    confirm(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, jsonwebtoken_1.verify)(token, secretJWT, optionJWT);
            if (decoded
                && typeof decoded !== "string"
                && decoded.account
                && typeof decoded.account.username === "string"
                && typeof decoded.account.password === "string") {
                helper_1.default.logger.traceWithTag("Signup, Confirm", "Decoded: Token data = " + JSON.stringify(decoded));
                return yield database_1.db.repository.account.comfirmEmail(decoded.account.username, decoded.account.password);
            }
            // Invalid input
            return undefined;
        });
    }
}
exports.default = SignUpHandler;
