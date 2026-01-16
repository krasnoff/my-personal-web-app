import { systemPrompt } from '@/lib/system_prompt';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMCPClient } from '@ai-sdk/mcp';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Check if GitHub token is configured
  if (!GITHUB_TOKEN) {
    return Response.json(
      { error: 'GitHub token not configured. Please set GITHUB_TOKEN environment variable.' },
      { status: 500 }
    );
  }

  const mcp = await createMCPClient({
    transport: {
      type: "http",
      url: "https://api.githubcopilot.com/mcp/", // remote GitHub MCP server
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        // Optional: limit enabled toolsets/tools (fine-grained + faster)
        // Toolset/tool headers are supported by the GitHub MCP server :contentReference[oaicite:6]{index=6}
        "X-MCP-Toolsets": "repos,users",
      },
    },
  });

  const google = createGoogleGenerativeAI({
        // custom settings
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
  });

  try {
    const tools = await mcp.tools(); // gets MCP tools as AI SDK tools :contentReference[oaicite:7]{index=7}

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools, // provide MCP tools to the model
      onFinish: async () => {
        // Close MCP client after streaming is complete
        await mcp.close();
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    await mcp.close();
    console.error('MCP Error:', error);
    return Response.json(
      { error: 'Failed to access GitHub API. Check your token permissions.' },
      { status: 500 }
    );
  }
}