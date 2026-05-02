#!/usr/bin/env node
/**
 * MCP Swiss Army — The Swiss Army knife of MCP servers
 * One connection. 16+ tools. Weather, stocks, news, search, translation, and more.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tools/index.js";

const VERSION = "1.0.0";

const server = new McpServer({
  name: "mcp-swiss-army",
  version: VERSION,
});

registerAllTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[MCP Swiss Army] Server started (v${VERSION})`);
}

main().catch((err) => {
  console.error(`[MCP Swiss Army] Fatal error: ${err.message}`);
  process.exit(1);
});
