import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const google = createGoogleGenerativeAI({
        // custom settings
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
  });


  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}