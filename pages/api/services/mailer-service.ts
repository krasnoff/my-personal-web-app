import {FormRequest} from "../interfaces/form-req";
import 'dotenv/config';
import nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";

async function sendmail(parameters: FormRequest): Promise<SMTPTransport.SentMessageInfo> {
                   
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 587,
        auth: {
          user: process.env.USER,
          pass: process.env.API_KEY
        }
    });

    const address_sender = {
        name: parameters.submissionObject.fullName,
        address: parameters.submissionObject.email
    }

    const mailOptions = {
        from: address_sender,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: parameters.submissionObject.email,
        subject: 'New Mail From my homepage',
        text: parameters.submissionObject.message,
        html: `<div style='text-direction: ltr'>fullName: ${parameters.submissionObject.fullName}</div><div style='text-direction: ltr'>Email: ${parameters.submissionObject.email}</div><br><div style='text-direction: ltr'>${parameters.submissionObject.message?.toString().replace('\n', '<br>')}</div>`
    }

    return await transporter.sendMail(mailOptions);
          
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    sendmail
}; 