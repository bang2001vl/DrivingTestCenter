"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTestMail = exports.sendResetPwdMail = exports.sendConfirmEmail = exports.sendMail = void 0;
const fs_1 = require("fs");
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const proxySender = "WebPhim <noreply@webphim.com>";
const smtpServerHost = 'smtp.gmail.com';
const smtpServerPort = 587;
const PATH_COMFIRM_HTML = path_1.default.resolve(config_1.default.resourceFolder, "template/confirmEmail.html");
function createTransporter() {
    return nodemailer_1.default.createTransport({
        host: smtpServerHost,
        port: smtpServerPort,
        secure: false,
        auth: {
            user: config_1.default.smtp_user,
            pass: config_1.default.smtp_pwd,
        }
    });
}
function sendMail(to, subject, htmlContent) {
    const transporter = createTransporter();
    const options = {
        from: proxySender,
        to: to,
        subject: subject,
        html: htmlContent
    };
    return transporter.sendMail(options);
}
exports.sendMail = sendMail;
function sendConfirmEmail(receiver, token) {
    const server_url = `http://${config_1.default.domain}:${config_1.default.port_http}/auth/signup/verify`;
    const link = `${server_url}?token=${token}`;
    const html = (0, fs_1.readFileSync)(PATH_COMFIRM_HTML, 'utf-8')
        .replace("${link}", link);
    const subject = "Please verify your email";
    return sendMail(receiver, subject, html);
}
exports.sendConfirmEmail = sendConfirmEmail;
function sendResetPwdMail(receiver, newPwd) {
    const html = "<p>Your new password is: ${newPassword}</p>"
        .replace("${newPassword}", newPwd);
    return createTransporter().sendMail({
        from: proxySender,
        to: receiver,
        subject: "Reset password",
        html: html
    });
}
exports.sendResetPwdMail = sendResetPwdMail;
function sendTestMail() {
    try {
        return sendMail("bang2001vl@outlook.com.vn", "test-email", "<h3>Your email has been sent successfully.</h3>");
    }
    catch (ex) {
        console.log(ex);
    }
    ;
}
exports.sendTestMail = sendTestMail;
class NodeMailerHelper {
    constructor() {
        this.sendMail = sendMail;
        this.sendConfirmEmail = sendConfirmEmail;
        this.sendTestMail = sendTestMail;
    }
}
exports.default = NodeMailerHelper;
