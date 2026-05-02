/**
 * Vercel Serverless Entry Point
 * Wraps OmniMCP as an HTTP SSE endpoint
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { registerAllTools } from "../src/tools/index.js";

let transport: SSEServerTransport | null = null;
const server = new McpServer({ name: "omnimcp", version: "1.0.0" });
registerAllTools(server);

export default async function handler(req: Request) {
  if (req.url?.endsWith("/sse")) {
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
  } else if (req.url?.endsWith("/messages")) {
    await transport?.handlePostMessage(req);
  }
}
