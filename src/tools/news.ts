import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const RSS_FEEDS: Record<string, string> = {
  tech: "https://news.ycombinator.com/rss",
  cnn: "http://rss.cnn.com/rss/cnn_topstories.rss",
  bbc: "http://feeds.bbci.co.uk/news/world/rss.xml",
  reuters: "https://feeds.reuters.com/reuters/topNews",
};

export function registerNewsTools(server: McpServer) {
  server.registerTool("get_news", {
    title: "Get Top News",
    description: "Get top news headlines from a selected source.",
    inputSchema: {
      source: z.enum(["tech", "cnn", "bbc", "reuters"]).describe("News source"),
      limit: z.number().int().min(1).max(20).optional().describe("Max headlines. Default: 10"),
    },
  }, async ({ source, limit = 10 }) => {
    try {
      const url = RSS_FEEDS[source] || RSS_FEEDS.tech;
      const res = await fetch(url);
      const xml = await res.text();
      const items: string[] = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      const titleRegex = /<title>(.*?)<\/title>/;
      const linkRegex = /<link>(.*?)<\/link>/;
      const descRegex = /<description>(.*?)<\/description>/;
      let itemMatch;
      let count = 0;
      while ((itemMatch = itemRegex.exec(xml)) !== null && count < limit) {
        const content = itemMatch[1];
        const title = titleRegex.exec(content)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1") || "";
        const link = linkRegex.exec(content)?.[1] || "";
        const desc = descRegex.exec(content)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")?.replace(/<[^>]*>/g, "").substring(0, 150) || "";
        items.push(`**${title}**\n${desc}\n${link}`);
        count++;
      }
      return { content: [{ type: "text" as const, text: `# Top Headlines (${source})\n\n${items.join("\n\n---\n\n")}` }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `News fetch failed: ${e.message}` }], isError: true };
    }
  });

  server.registerTool("hackernews", {
    title: "Hacker News Top Stories",
    description: "Get current top stories from Hacker News.",
    inputSchema: {
      count: z.number().int().min(1).max(30).optional().describe("Number of stories. Default: 10"),
    },
  }, async ({ count = 10 }) => {
    try {
      const idsRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const ids: number[] = await idsRes.json();
      const stories: string[] = [];
      for (const id of ids.slice(0, count)) {
        const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const story = await storyRes.json();
        if (story && story.title) {
          stories.push(`**${story.title}**\nScore: ${story.score || 0} | Comments: ${story.descendants || 0}\n${story.url || "(No URL)"}`);
        }
      }
      return { content: [{ type: "text" as const, text: `# Hacker News Top ${count}\n\n${stories.join("\n\n---\n\n")}` }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `Hacker News fetch failed: ${e.message}` }], isError: true };
    }
  });
}
