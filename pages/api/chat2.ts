import { NextApiRequest, NextApiResponse } from "next";
import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { systemPrompt } from '../../lib/system_prompt_plant_identifier';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    try {
        if (req.method === 'POST') {
            const { messages } = req.body as { messages?: any[] };

            if (!Array.isArray(messages)) {
                return res.status(400).json({ error: 'Invalid request body. Expected { messages: UIMessage[] }.' });
            }

            if (!process.env.OPENAI_API_KEY) {
                return res.status(500).json({ error: 'OPENAI_API_KEY is not set.' });
            }

            try {
                // Transform UIMessages to ModelMessages format
                const modelMessages = messages.map((message) => ({
                    role: message.role,
                    content: message.parts,
                }));

                const result = await generateText({
                    model: openai('gpt-4o-mini'),
                    system: systemPrompt,
                    messages: modelMessages,
                });

                return res.json({ 
                    response: result.text,
                    usage: result.usage 
                });
            } catch (error) {
                console.error('Error:', error);
                return res.status(500).json({ error: 'Chat request failed.' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (err) {
        console.log(err, process.env); 
        res.status(500).json({ error: 'failed to load data' });
    }
}