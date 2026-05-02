import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerDevTools(server: McpServer) {
  server.registerTool("github_repo", {
    title: "GitHub Repository Info",
    description: "Get detailed info about a GitHub repository.",
    inputSchema: {
      owner: z.string().describe("Repository owner, e.g. 'microsoft', 'facebook'"),
      repo: z.string().describe("Repository name, e.g. 'TypeScript', 'react'"),
    },
  }, async ({ owner, repo }) => {
    try {
      const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
      const res = await fetch(url);
      if (!res.ok) return { content: [{ type: "text" as const, text: `Repository "${owner}/${repo}" not found.` }] };
      const data = await res.json();
      const info = [
        `# ${data.full_name}`,
        data.description ? `> ${data.description}` : "",
        `⭐ Stars: ${data.stargazers_count}`,
        `🍴 Forks: ${data.forks_count}`,
        `📌 Open Issues: ${data.open_issues_count}`,
        `🌐 Language: ${data.language || "N/A"}`,
        `📅 Created: ${new Date(data.created_at).toLocaleDateString()}`,
        `🔄 Updated: ${new Date(data.updated_at).toLocaleDateString()}`,
        `📄 License: ${data.license?.spdx_id || "N/A"}`,
        `🔗 ${data.html_url}`,
      ].join("\n");
      return { content: [{ type: "text" as const, text: info }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `GitHub lookup failed: ${e.message}` }], isError: true };
    }
  });

  server.registerTool("npm_package", {
    title: "npm Package Info",
    description: "Get info about an npm package.",
    inputSchema: {
      name: z.string().describe("Package name, e.g. 'react', 'express'"),
    },
  }, async ({ name }) => {
    try {
      const url = `https://registry.npmjs.org/${encodeURIComponent(name)}/latest`;
      const res = await fetch(url);
      if (!res.ok) return { content: [{ type: "text" as const, text: `Package "${name}" not found on npm.` }] };
      const data = await res.json();
      const info = [
        `# ${data.name} @${data.version}`,
        data.description ? `> ${data.description}` : "",
        `📄 License: ${data.license || "N/A"}`,
        `🔧 Dependencies: ${Object.keys(data.dependencies || {}).length}`,
        `🔗 https://www.npmjs.com/package/${data.name}`,
      ].join("\n");
      return { content: [{ type: "text" as const, text: info }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `npm lookup failed: ${e.message}` }], isError: true };
    }
  });
}
