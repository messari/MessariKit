# Messari Ask MCP Server

An MCP server implementation that integrates the Messari API to provide Claude with unparalleled real-time, crypto research.

TODO: ADD SCREENSHOT
TODO: Finish the integration and prove it works in Claude desktop or console.claude.ai
    - Have it working in local mcp inspector (times out sometimes...)
    - Command to run in inspector: `npx @modelcontextprotocol/inspector -e MESSARI_API_KEY=<YOUR_API_KEY_HERE> node dist/index.j`


## Tools

- **messari-copilot**
  - Engage in a conversation with the Messari Copilot API for crypto research insights.
  - **Inputs:**
    - `messages` (array): An array of conversation messages.
      - Each message must include:
        - `role` (string): The role of the message (e.g., `system`, `user`, `assistant`).
        - `content` (string): The content of the message.

## Configuration

### Step 1: 

Clone the MCP repository:

```bash
git clone https://github.com/messari/MessariKit.git
```

Navigate to the `mcp` directory and install the necessary dependencies:

```bash
cd packages/mcp && pnpm install
```

To use the Messari Action Provider, you need to obtain a Messari API key by following these steps:

1. Sign up for a Messari account at [messari.io](https://messari.io/)
2. After signing up, navigate to [messari.io/account/api](https://messari.io/account/api)
3. Generate your API key from the account dashboard

For more detailed information about authentication, refer to the [Messari API Authentication documentation](https://docs.messari.io/reference/authentication).

Different subscription tiers provide different levels of access to the API. See the [Rate Limiting](#rate-limiting) section for details.

### Step 3: Configure Claude Desktop

1. Download Claude desktop [here](https://claude.ai/download). 

2. Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "messari-copilot": {
      "command": "npx",
      "args": [
        "-y",
        "@messari/modelcontextprovider"
      ],
      "env": {
        "MESSARI_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

You can access the file using:

```bash
vim ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Step 4: Build the Docker Image

Docker build:

```bash
docker build -t mcp/messari-copilot:latest -f src/messari-copilot/Dockerfile .
```

### Step 5: Testing

Let’s make sure Claude for Desktop is picking up the two tools we’ve exposed in our `messari-copilot` server. You can do this by looking for the hammer icon:

![Claude Visual Tools](perplexity-ask/assets/visual-indicator-mcp-tools.png)

After clicking on the hammer icon, you should see the tools that come with the Filesystem MCP Server:

![Available Integration](perplexity-ask/assets/available_tools.png)

If you see both of these this means that the integration is active. Congratulations! This means Claude can now ask Messari. You can then simply use it as you would use the Messari copilot via the web app.

### Step 6: Advanced parameters

Currently, the search parameters used are the default ones. You can modify any search parameter in the API call directly in the `index.ts` script. For this, please refer to the official [API documentation](https://docs.messari.io/reference/chat-completion).

### Rate Limiting

The Messari API has rate limits based on your subscription tier:

| Subscription Tier | Daily Request Limit |
|-------------------|---------------------|
| Free (Unpaid)     | 2 requests per day  |
| Lite              | 10 requests per day |
| Pro               | 20 requests per day |
| Enterprise        | 50 requests per day |

If you need more than 50 requests per day, you can contact Messari's sales team to discuss a custom credit allocation system for your specific needs.

### Troubleshooting 

The Claude documentation provides an excellent [troubleshooting guide](https://modelcontextprotocol.io/docs/tools/debugging) you can refer to. However, you can still reach out to us at contact@messari.io for any additional support or [file a bug](https://github.com/messari/MessariKit/issues). 


## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.

