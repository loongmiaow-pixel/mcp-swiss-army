import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerUtilityTools(server: McpServer) {
  server.registerTool("calculator", {
    title: "Calculator",
    description: "Evaluate a mathematical expression.",
    inputSchema: {
      expression: z.string().describe("Math expression, e.g. '2 + 2 * 3'"),
    },
  }, async ({ expression }) => {
    try {
      const result = new Function(`"use strict"; return (${expression})`)();
      return { content: [{ type: "text" as const, text: String(result) }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `Error: ${e.message}` }], isError: true };
    }
  });

  server.registerTool("current_time", {
    title: "Current Time",
    description: "Get the current date and time in any timezone.",
    inputSchema: {
      timezone: z.string().optional().describe("IANA timezone, e.g. 'Asia/Shanghai'. Default: UTC"),
    },
  }, async ({ timezone = "UTC" }) => {
    const now = new Date();
    const opts: Intl.DateTimeFormatOptions = {
      timeZone: timezone, weekday: "long", year: "numeric", month: "long",
      day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short",
    };
    return { content: [{ type: "text" as const, text: now.toLocaleString("en-US", opts) }] };
  });

  server.registerTool("ip_info", {
    title: "IP Information",
    description: "Get geolocation info for an IP address.",
    inputSchema: {
      ip: z.string().optional().describe("IP address. Leave empty for server IP."),
    },
  }, async ({ ip }) => {
    try {
      const url = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/";
      const res = await fetch(url);
      const data = await res.json();
      const info = `IP: ${data.ip}\nCity: ${data.city}\nRegion: ${data.region}\nCountry: ${data.country_name}\nLat/Lon: ${data.latitude}, ${data.longitude}\nISP: ${data.org}`;
      return { content: [{ type: "text" as const, text: info }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `IP lookup failed: ${e.message}` }], isError: true };
    }
  });

  server.registerTool("generate_uuid", {
    title: "Generate UUID",
    description: "Generate one or more random UUIDs (v4).",
    inputSchema: {
      count: z.number().int().min(1).max(20).optional().describe("Number of UUIDs. Default: 1"),
    },
  }, async ({ count = 1 }) => {
    const uuids = Array.from({ length: count }, () => crypto.randomUUID());
    return { content: [{ type: "text" as const, text: uuids.join("\n") }] };
  });
}
