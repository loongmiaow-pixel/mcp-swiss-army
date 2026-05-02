import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerLanguageTools(server: McpServer) {
  server.registerTool("translate", {
    title: "Translate Text",
    description: "Translate text between languages. Supports 100+ languages.",
    inputSchema: {
      text: z.string().describe("Text to translate"),
      from: z.string().optional().describe("Source language code, e.g. 'en', 'zh', 'ja'. Auto-detect if omitted"),
      to: z.string().describe("Target language code, e.g. 'en', 'zh', 'ja', 'es', 'fr'"),
    },
  }, async ({ text, from, to }) => {
    try {
      const langpair = from ? `${from}|${to}` : `auto|${to}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.responseStatus === 200) {
        return { content: [{ type: "text" as const, text: `**Translation (${data.responseDetails.sourceLanguage || "auto"} → ${to})**\n\n${data.responseData.translatedText}` }] };
      }
      return { content: [{ type: "text" as const, text: `Translation failed: ${data.responseDetails || "Unknown error"}` }], isError: true };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `Translation failed: ${e.message}` }], isError: true };
    }
  });

  server.registerTool("text_analysis", {
    title: "Text Analysis",
    description: "Analyze text for word count, character count, sentences, reading time, and keyword frequency.",
    inputSchema: {
      text: z.string().describe("Text to analyze"),
    },
  }, async ({ text }) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chars = text.length;
    const avgWordLength = (words.reduce((sum, w) => sum + w.length, 0) / words.length).toFixed(1);
    const readingTime = Math.ceil(words.length / 200);

    const stopWords = new Set(["the","a","an","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","must","shall","can","to","of","in","for","on","with","at","by","from","as","into","through","during","before","after","above","below","between","out","off","over","under","again","further","then","once","and","but","or","nor","not","so","yet","both","either","neither","each","every","all","any","few","more","most","other","some","such","no","only","own","same","than","too","very","just","because","if","when","where","which","while","who","whom","what","that","this","these","those","i","me","my","we","our","you","your","he","him","his","she","her","it","its","they","them","their"]);
    const freq: Record<string, number> = {};
    for (const w of words) {
      const lower = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (lower.length > 2 && !stopWords.has(lower)) freq[lower] = (freq[lower] || 0) + 1;
    }
    const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const analysis = [
      "# Text Analysis", "",
      `- **Words:** ${words.length}`,
      `- **Characters:** ${chars}`,
      `- **Sentences:** ${sentences.length}`,
      `- **Avg word length:** ${avgWordLength} letters`,
      `- **Reading time:** ~${readingTime} minute(s)`, "",
      "### Top Keywords", "| Word | Count |", "|------|------:|",
      ...topWords.map(([word, count]) => `| ${word} | ${count} |`),
    ].join("\n");
    return { content: [{ type: "text" as const, text: analysis }] };
  });
}
