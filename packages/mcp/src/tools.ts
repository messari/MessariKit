import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const copilotTool: Tool = {
  name: "messari-copilot",
  description: `This tool queries Messari AI for comprehensive crypto research across these datasets:
1. News/Content - Latest crypto news, blogs, podcasts
2. Exchanges - CEX/DEX volumes, market share, assets listed
3. Onchain Data - Active addresses, transaction fees, total transactions.
4. Token Unlocks - Upcoming supply unlocks, vesting schedules, and token emission details
5. Market Data - Asset prices, trading volume, market cap, TVL, and historical performance
6. Fundraising - Investment data, funding rounds, venture capital activity.
7. Protocol Research - Technical analysis of how protocols work, tokenomics, and yield mechanisms
8. Social Data - Twitter followers and Reddit subscribers metrics, growth trends

Examples:
- "Which DEXs have the highest trading volume this month?"
- "When is Arbitrum's next major token unlock?"
- "How does Morpho generate yield for users?"
- "Which cryptocurrency has gained the most Twitter followers in 2023?"
- "What did Vitalik Buterin say about rollups in his recent blog posts?"`,
  inputSchema: {
    type: "object",
    properties: {
      messages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            role: { type: "string" },
            content: { type: "string" },
          },
          required: ["role", "content"],
        },
      },
    },
    required: ["messages"],
  },
};
