import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerUtilityTools } from "./utility.js";
import { registerWeatherTools } from "./weather.js";
import { registerSearchTools } from "./search.js";
import { registerNewsTools } from "./news.js";
import { registerFinanceTools } from "./finance.js";
import { registerDevTools } from "./devtools.js";
import { registerLanguageTools } from "./language.js";

export function registerAllTools(server: McpServer) {
  registerUtilityTools(server);
  registerWeatherTools(server);
  registerSearchTools(server);
  registerNewsTools(server);
  registerFinanceTools(server);
  registerDevTools(server);
  registerLanguageTools(server);
}
