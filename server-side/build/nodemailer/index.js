"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const adminEmail = '19520397@gm.uit.edu.vn';
const adminPassword = 'hejjbuvhobbsuasb';
const proxySender = "WebPhim <noreply@webphim.com>";
const smtpServerHost = 'smtp.gmail.com';
const smtpServerPort = 587;
const emailTemplate = {
    confirmEmail: (0, fs_1.readFileSync)(path_1.default.resolve('nodemailer/template/confirmEmail.html'), 'utf-8'),
};
class NodeMailerHelper {
    sendMail(to, subject, htmlContent) {
        const transporter = nodemailer_1.default.createTransport({
            host: smtpServerHost,
            port: smtpServerPort,
            secure: false,
            auth: {
                user: adminEmail,
                pass: adminPassword
            }
        });
        const options = {
            from: proxySender,
            to: to,
            subject: subject,
            html: htmlContent
        };
        return transporter.sendMail(options);
    }
    sendTestMail() {
        return this.sendMail("bang2001vl@outlook.com.vn", "test-email", "<h3>Your email has been sent successfully.</h3>");
    }
    sendConfirmEmail(receiver, link) {
        const html = emailTemplate.confirmEmail.replace("${link}", link);
        const subject = "Please verify your email";
        return this.sendMail(receiver, subject, html);
    }
}
exports.default = NodeMailerHelper;
