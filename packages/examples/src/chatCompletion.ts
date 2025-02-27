import { MessariClient } from "@messari-kit/api";
import type { createChatCompletionParameters } from "@messari-kit/types";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variable
const API_KEY = process.env.MESSARI_API_KEY;

// Check if API key is available
if (!API_KEY) {
  console.error("Error: MESSARI_API_KEY environment variable is not set.");
  console.error("Please create a .env file with your API key or set it in your environment.");
  process.exit(1);
}

// Initialize the Messari client
const client = new MessariClient({
  apiKey: API_KEY,
});

async function main() {
  try {
    // Define the chat completion parameters
    const params: createChatCompletionParameters = {
      messages: [
        {
          role: "user",
          content: "What companies have both paradigm and multicoin on their cap table?",
        },
      ],
    };

    console.log("Sending chat completion request...");

    // Call the createChatCompletion endpoint
    const response = await client.ai.createChatCompletion(params);

    console.log("Response received:");
    console.log(JSON.stringify(response, null, 2));

    // Access the assistant's response
    const assistantMessage = response.messages[0];
    console.log("\nAssistant's response:");
    console.log(assistantMessage.content);
  } catch (error) {
    console.error("Error calling createChatCompletion:", error);
  }
}

main().catch(console.error);
