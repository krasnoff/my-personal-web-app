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
        const e = err as { name?: string; code?: string };
        console.error('Contact email submission failed', { name: e?.name, code: e?.code });
        res.status(500).json({ error: 'failed to load data' });
    }
}