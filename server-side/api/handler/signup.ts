import { sign, decode, verify, JwtPayload } from "jsonwebtoken";
import appConfig from "../../config";
import {db} from "../../database";
import helper from "../../helper";
import NodeMailerHelper from "../../nodemailer";

interface InputData {
    account: {
        username: string;
        password: string;
    }
    userInfo: {
        fullname: string;
        email: string;
        //phone: string;
        gender: number;
        address: string;
        //avatarPath: string;
    }
}

const secretJWT = "asdjb!@#!523BD#@$";
const optionJWT = {
    issuer: "n2tb",
    audience: "thunder-server-2",
}

const mailer = new NodeMailerHelper();

export default class SignUpHandler{
    validInput(data: any) {
        return (
            data
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
    validInput_Confirm(data: any) {
        return (
            typeof (data.token === "string")
        );
    }
    async signupStudent(data: any){
        const account: any = await db.repository.account.insert(data.account);

        // Set accountId
        data.studentData.accountId = account.id;

        const student = await db.repository.student.insert(data.studentData);
        //helper.logger.traceWithTag("[INSERTED][UserInfo]", JSON.stringify(student));
    }
    async sendVerifyEmail(account: any, info: any) {
        const token = sign({
            account: {
                username: account.username,
                password: account.password,
            }
        }, secretJWT, {
            ...optionJWT,
            expiresIn: 48 * 60 * 60, // 48 hours
        })
        const link = `${appConfig.domain}/signup/verify?token=${token}`;
        const receiver = {
            email: info.email,
            fullname: info.fullname,
        };
        await mailer.sendConfirmEmail(receiver.email, link);
    }
    async confirm(token: string) {
        const decoded = verify(token, secretJWT, optionJWT);
        if (decoded
            && typeof decoded !== "string"
            && decoded.account
            && typeof decoded.account.username === "string"
            && typeof decoded.account.password === "string"
        ) {
            helper.logger.traceWithTag("Signup, Confirm", "Decoded: Token data = " + JSON.stringify(decoded));
            return await db.repository.account.comfirmEmail(decoded.account.username, decoded.account.password);
        }
        
        // Invalid input
        return undefined;
    }
}