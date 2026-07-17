import { systemPrompt } from '@/lib/system_prompt';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMCPClient } from '@ai-sdk/mcp';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
// import { BudgetService } from '../../../pages/api/services/budget-service';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = 'krasnoff';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function scopeGitHubSearchInput(input: unknown) {
  if (!isPlainObject(input)) {
    return input;
  }

  const query = typeof input.query === 'string' ? input.query : '';

  if (!query) {
    return input;
  }

  const normalizedQuery = query
    .replace(/\b(?:user|org):[^\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    ...input,
    query: [
      normalizedQuery,
      `user:${GITHUB_OWNER}`,
      'fork:false',
      'archived:false',
    ]
      .filter(Boolean)
      .join(' '),
  };
}

function isPersonalRepositoryItem(item: unknown) {
  if (!isPlainObject(item)) {
    return false;
  }

  const ownerLogin =
    isPlainObject(item.owner) && typeof item.owner.login === 'string'
      ? item.owner.login
      : isPlainObject(item.repository) &&
          isPlainObject(item.repository.owner) &&
          typeof item.repository.owner.login === 'string'
        ? item.repository.owner.login
        : typeof item.full_name === 'string'
          ? item.full_name.split('/')[0]
          : null;

  return ownerLogin === GITHUB_OWNER;
}

function scopeMcpToolOutput(output: unknown) {
  if (!isPlainObject(output) || !Array.isArray(output.items)) {
    return output;
  }

  const items = output.items.filter(isPersonalRepositoryItem);

  return {
    ...output,
    items,
    total_count: typeof output.total_count === 'number' ? items.length : output.total_count,
  };
}

function scopeMcpTools(tools: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(tools).map(([toolName, tool]) => {
      if (
        (toolName !== 'search_repositories' && toolName !== 'search_code') ||
        typeof tool?.execute !== 'function'
      ) {
        return [toolName, tool];
      }

      return [
        toolName,
        {
          ...tool,
          execute: async (input: unknown, options: unknown) => {
            const scopedInput = scopeGitHubSearchInput(input);
            const output = await tool.execute(scopedInput, options);
            return scopeMcpToolOutput(output);
          },
        },
      ];
    }),
  );
}

// const budgetService = new BudgetService();

export async function POST(req: Request) {
  // const isExceeded = await budgetService.isBudgetExceeded(
  //     process.env.BILLING_ID || '',
  //     process.env.BUDGET_NAME || ''
  // );

  // if (isExceeded) {
  //   throw new Error(`Budget exceeded. Please check your Google Cloud Billing settings.`);
  // }

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
    const tools = scopeMcpTools(await mcp.tools()); // gets MCP tools as AI SDK tools :contentReference[oaicite:7]{index=7}

    const result = streamText({
      model: google('gemini-2.5-flash-lite'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools, // provide MCP tools to the model
      onFinish: async () => {
        // Close MCP client after streaming is complete
        await mcp.close();
      },
      onError: async (error) => {
        await mcp.close();
        console.error('AI Model Error:', error);
        throw new Error(`AI model failed: ${error}`);
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    await mcp.close();
    console.error('Error:', error);
    // If it's our custom AI error, re-throw it
    if (error instanceof Error && error.message.startsWith('AI model failed:')) {
      throw error;
    }
    return Response.json(
      { error: 'Failed to access GitHub API. Check your token permissions.' },
      { status: 500 }
    );
  }
}