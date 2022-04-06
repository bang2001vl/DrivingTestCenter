
import { readFileSync } from 'fs';
import nodeMailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';

const adminEmail = '19520397@gm.uit.edu.vn';
const adminPassword = 'hejjbuvhobbsuasb';

const proxySender = "WebPhim <noreply@webphim.com>";

const smtpServerHost = 'smtp.gmail.com';
const smtpServerPort = 587;

const emailTemplate = {
  confirmEmail: readFileSync(path.resolve('nodemailer/template/confirmEmail.html'), 'utf-8'),
}

export default class NodeMailerHelper {
  sendMail(to: any, subject: any, htmlContent: any) {
    const transporter = nodeMailer.createTransport({
      host: smtpServerHost,
      port: smtpServerPort,
      secure: false,
      auth: {
        user: adminEmail,
        pass: adminPassword
      }
    })
    const options: Mail.Options = {
      from: proxySender,
      to: to,
      subject: subject,
      html: htmlContent
    }

    return transporter.sendMail(options)
  }
  sendTestMail() {
    return this.sendMail("bang2001vl@outlook.com.vn", "test-email", "<h3>Your email has been sent successfully.</h3>");
  }
  sendConfirmEmail(receiver: string, link: string){
    const html = emailTemplate.confirmEmail.replace("${link}", link);
    const subject = "Please verify your email";
    return this.sendMail(receiver, subject, html);
  }
}