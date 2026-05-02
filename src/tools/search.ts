import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerSearchTools(server: McpServer) {
  server.registerTool("web_search", {
    title: "Web Search",
    description: "Search the web and return top results.",
    inputSchema: {
      query: z.string().describe("Search query"),
      num_results: z.number().int().min(1).max(10).optional().describe("Number of results. Default: 5"),
    },
  }, async ({ query, num_results = 5 }) => {
    try {
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; OmniMCP/1.0)" } });
      const html = await res.text();
      const results: string[] = [];
      const resultRegex = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>(.*?)<\/a>/gi;
      let match;
      let count = 0;
      while ((match = resultRegex.exec(html)) !== null && count < num_results) {
        results.push(`Title: ${match[2]}\nURL: ${match[1]}\nSnippet: ${match[3]}`);
        count++;
      }
      if (results.length === 0) return { content: [{ type: "text" as const, text: `No results found for "${query}".` }] };
      return { content: [{ type: "text" as const, text: `Search results for "${query}":\n\n${results.join("\n\n---\n\n")}` }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `Search failed: ${e.message}` }], isError: true };
    }
  });

  server.registerTool("wikipedia", {
    title: "Wikipedia Summary",
    description: "Get the Wikipedia summary for any topic.",
    inputSchema: {
      topic: z.string().describe("Topic to search"),
      lang: z.string().optional().describe("Language code, e.g. 'en', 'zh'. Default: en"),
    },
  }, async ({ topic, lang = "en" }) => {
    try {
      const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
      const res = await fetch(url);
      if (!res.ok) return { content: [{ type: "text" as const, text: `No Wikipedia article found for "${topic}" in ${lang}.` }] };
      const data = await res.json();
      return { content: [{ type: "text" as const, text: `# ${data.title}\n\n${data.extract}\n\n📖 [Read more](${data.content_urls?.desktop?.page || data.content_urls?.mobile?.page})` }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `Wikipedia lookup failed: ${e.message}` }], isError: true };
    }
  });

  server.registerTool("dictionary", {
    title: "Dictionary Definition",
    description: "Get definition, pronunciation, and examples for any English word.",
    inputSchema: {
      word: z.string().describe("English word to look up"),
    },
  }, async ({ word }) => {
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
      const res = await fetch(url);
      if (!res.ok) return { content: [{ type: "text" as const, text: `No definition found for "${word}".` }] };
      const data = await res.json();
      const entry = data[0];
      let output = `# ${entry.word}`;
      if (entry.phonetic) output += ` — ${entry.phonetic}`;
      if (entry.phonetics?.length) {
        const audio = entry.phonetics.find((p: any) => p.audio)?.audio;
        if (audio) output += `\n🔊 [Listen](${audio})`;
      }
      output += "\n\n";
      for (const meaning of entry.meanings) {
        output += `## ${meaning.partOfSpeech}\n`;
        for (const def of meaning.definitions.slice(0, 3)) {
          output += `- ${def.definition}`;
          if (def.example) output += `\n  *Example: ${def.example}*`;
          output += "\n";
        }
      }
      return { content: [{ type: "text" as const, text: output }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `Dictionary lookup failed: ${e.message}` }], isError: true };
    }
  });
}
