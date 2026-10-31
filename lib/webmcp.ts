// Keep the experimental browser API local rather than extending DOM globals.
export interface WebMCPTool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations?: Record<string, boolean>;
    execute: (input: unknown, options?: { signal?: AbortSignal }) => Promise<unknown>;
}

interface ModelContext {
    registerTool(tool: WebMCPTool, options?: { signal: AbortSignal }): void | Promise<void>;
    unregisterTool?: (name: string) => void;
}

export function registerWebMCPTool(tool: WebMCPTool): () => void {
    const current = (document as Document & { modelContext?: ModelContext }).modelContext;
    const legacy = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    const context = current ?? legacy;
    if (!context) return () => {};

    const controller = new AbortController();
    try {
        Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() => {
            // Registration failure must not interrupt the manual contact form.
        });
    } catch {
        // Some experimental implementations expose an incompatible API.
    }
    return () => {
        controller.abort();
        if (!current) context.unregisterTool?.(tool.name);
    };
}
