import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerWeatherTools(server: McpServer) {
  server.registerTool("get_weather", {
    title: "Get Weather",
    description: "Get current weather and 3-day forecast for any city.",
    inputSchema: {
      location: z.string().describe("City name, e.g. 'Beijing', 'New York'"),
      format: z.enum(["short", "detailed"]).optional().describe("Output format. Default: short"),
    },
  }, async ({ location, format = "short" }) => {
    try {
      const query = format === "detailed" ? "4" : "2";
      const url = `https://wttr.in/${encodeURIComponent(location)}?format=${query}&lang=en`;
      const res = await fetch(url);
      const text = await res.text();
      return { content: [{ type: "text" as const, text: text.trim() }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `Weather lookup failed: ${e.message}` }], isError: true };
    }
  });
}
