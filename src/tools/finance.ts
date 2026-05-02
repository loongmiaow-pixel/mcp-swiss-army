import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerFinanceTools(server: McpServer) {
  server.registerTool("stock_quote", {
    title: "Stock Quote",
    description: "Get current stock price and basic info for a ticker symbol.",
    inputSchema: {
      symbol: z.string().describe("Stock ticker, e.g. 'AAPL', 'GOOGL', 'TSLA', 'BABA'"),
    },
  }, async ({ symbol }) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; OmniMCP/1.0)" } });
      const data = await res.json();
      const result = data.chart?.result?.[0];
      if (!result) return { content: [{ type: "text" as const, text: `Stock "${symbol}" not found.` }] };
      const meta = result.meta;
      const info = [
        `# ${meta.symbol} — ${meta.shortName || meta.longName}`,
        ``,
        `Price: $${meta.regularMarketPrice}`,
        `Change: ${meta.regularMarketChangePercent?.toFixed(2)}%`,
        `Open: $${meta.regularMarketOpen}`,
        `High: $${meta.regularMarketDayHigh}`,
        `Low: $${meta.regularMarketDayLow}`,
        `Previous Close: $${meta.chartPreviousClose}`,
        `Market Cap: ${formatMarketCap(meta.marketCap)}`,
      ].join("\n");
      return { content: [{ type: "text" as const, text: info }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `Stock lookup failed: ${e.message}` }], isError: true };
    }
  });

  server.registerTool("currency_convert", {
    title: "Currency Converter",
    description: "Convert between currencies using live exchange rates.",
    inputSchema: {
      from: z.string().describe("Source currency code, e.g. 'USD', 'EUR', 'CNY'"),
      to: z.string().describe("Target currency code, e.g. 'USD', 'EUR', 'CNY'"),
      amount: z.number().optional().describe("Amount to convert. Default: 1"),
    },
  }, async ({ from, to, amount = 1 }) => {
    try {
      const url = `https://api.exchangerate-api.com/v4/latest/${encodeURIComponent(from)}`;
      const res = await fetch(url);
      const data = await res.json();
      const rate = data.rates?.[to.toUpperCase()];
      if (!rate) return { content: [{ type: "text" as const, text: `Currency pair ${from}/${to} not available.` }] };
      const result = (amount * rate).toFixed(2);
      return { content: [{ type: "text" as const, text: `${amount} ${from.toUpperCase()} = ${result} ${to.toUpperCase()}\nRate: 1 ${from} = ${rate} ${to}` }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `Currency conversion failed: ${e.message}` }], isError: true };
    }
  });
}

function formatMarketCap(cap: number): string {
  if (!cap) return "N/A";
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(1)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(1)}M`;
  return `$${cap}`;
}
