
import { readFileSync } from 'fs';
import nodeMailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';
import appConfig from '../config';

const proxySender = "WebPhim <noreply@webphim.com>";

const smtpServerHost = 'smtp.gmail.com';
const smtpServerPort = 587;

const PATH_COMFIRM_HTML = path.resolve(appConfig.resourceFolder, "template/confirmEmail.html");

function createTransporter(){
  return nodeMailer.createTransport({
    host: smtpServerHost,
    port: smtpServerPort,
    secure: false,
    auth: {
      user: appConfig.smtp_user,
      pass: appConfig.smtp_pwd,
    }
  });
}

export function sendMail(to: any, subject: any, htmlContent: any) {
  const transporter = createTransporter();
  const options: Mail.Options = {
    from: proxySender,
    to: to,
    subject: subject,
    html: htmlContent
  }

  return transporter.sendMail(options)
}

export function sendConfirmEmail(receiver: string, token: string) {
  const server_url = `http://${appConfig.domain}:${appConfig.port_http}/auth/signup/verify`;
  const link = `${server_url}?token=${token}`;
  const html = readFileSync(PATH_COMFIRM_HTML, 'utf-8')
    .replace("${link}", link);
  const subject = "Please verify your email";
  return sendMail(receiver, subject, html);
}

export function sendResetPwdMail(receiver: string, newPwd: string){
  const html = "<p>Your new password is: ${newPassword}</p>"
  .replace("${newPassword}", newPwd);
  return createTransporter().sendMail({
    from: proxySender,
    to: receiver,
    subject: "Reset password",
    html: html
  });
}

export function sendTestMail() {
  try {
    return sendMail("bang2001vl@outlook.com.vn", "test-email", "<h3>Your email has been sent successfully.</h3>")
  }
  catch (ex: any) {
    console.log(ex);

  };
}

export default class NodeMailerHelper {
  sendMail = sendMail;
  sendConfirmEmail = sendConfirmEmail;
  sendTestMail = sendTestMail;
}