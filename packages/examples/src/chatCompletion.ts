import { MessariClient } from "@messari-kit/api";
import { createChatCompletionParameters } from "@messari-kit/types";

// Stub API key (replace with your actual API key in a real application)
const API_KEY = "your-api-key-here";

// Initialize the Messari client
const client = new MessariClient({
  apiKey: API_KEY,
  // Optional: Override the base URL if needed
  // baseUrl: "https://api.messari.io/ai",
});

async function runChatCompletionExample() {
  try {
    // Define the chat completion parameters
    const params: createChatCompletionParameters = {
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides information about blockchain and crypto.",
        },
        {
          role: "user",
          content: "What is Ethereum?",
        },
      ],
      // Optional parameters
      response_format: "text",
      verbosity: "normal",
      stream: false,
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

// Run the example
runChatCompletionExample();
