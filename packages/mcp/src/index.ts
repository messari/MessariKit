import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { MessariClient } from "@messari/sdk";
import dotenv from "dotenv";

import { copilotTool } from "./tools";

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variable
const API_KEY = process.env.MESSARI_API_KEY;

if (!API_KEY) {
  // Check if API key is available
  console.error("Error: MESSARI_API_KEY environment variable is not set.");
  console.error("Please create a .env file with your API key or set it in your environment.");
  process.exit(1);
}

const main = async () => {
  try {
    // Create an MCP server
    const server = new Server(
      {
        name: "Messari AI ToolKit MCP Server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {
            listChanged: false, // Tool list is static
          },
        },
        instructions: "You are a helpful assistant that can answer questions related to crypto research.",
      },
    );

    // Initialize the Messari client
    const messariClient = new MessariClient({
      apiKey: API_KEY,
    });

    /**
     * Registers a handler for listing available tools.
     * When the client requests a list of tools, this handler returns the Perplexity Ask Tool.
     */
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [copilotTool],
    }));

    /**
     * Registers a handler for calling a specific tool.
     * Processes requests by validating input and invoking the appropriate tool.
     *
     * @param {object} request - The incoming tool call request.
     * @returns {Promise<object>} The response containing the tool's result or an error.
     */
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        if (!args) {
          throw new Error("No arguments provided");
        }

        switch (name) {
          case copilotTool.name: {
            if (!Array.isArray(args.messages)) {
              throw new Error("Invalid arguments for messari-copilot: 'messages' must be an array");
            }
            const response = await messariClient.ai.createChatCompletion({
              messages: args.messages,
            });
            return {
              content: [{ type: "text", text: response.messages[0].content }],
              isError: false,
            };
          }
          default:
            // Respond with an error if an unknown tool is requested
            return {
              content: [{ type: "text", text: `Unknown tool: ${name}` }],
              isError: true,
            };
        }
      } catch (error) {
        // Return error details in the response
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Messari MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error running Messari MCP Server:", error);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error("Messari MCP Server error:", error);
  process.exit(1);
});
