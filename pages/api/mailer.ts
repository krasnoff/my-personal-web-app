import { NextApiRequest, NextApiResponse } from "next";
import mailerService from "./services/mailer-service";
import { FormRequest } from "./interfaces/form-req";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import 'dotenv/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    
    try {
        if (req.method === 'POST') {
            const message: FormRequest  = req.body;
            const data: SMTPTransport.SentMessageInfo = await mailerService.sendmail(message);
            res.status(200).json(data.response);
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (err) {
        console.log(err, process.env); 
        res.status(500).json({ error: JSON.stringify(process.env) });
    }
}