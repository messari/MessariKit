import { MessariClient } from "@messari/sdk";
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
    console.log("--------------------------------");
    console.log("AI Chat Completion");
    console.log("--------------------------------");
    console.log("Sending request...");
    console.log(`"What companies have both paradigm and a16z on their cap table?"`);

    // Call the createChatCompletion endpoint
    const response = await client.ai.createChatCompletion({
      messages: [
        {
          role: "user",
          content: "What companies have both paradigm and a16z on their cap table?",
        },
      ],
      verbosity: "succinct",
      response_format: "plaintext",
      inline_citations: false,
      stream: false,
    });

    const assistantMessage = response.messages[0].content;
    console.log(assistantMessage);
  } catch (error) {
    console.error("Error calling createChatCompletion:", error);
  }

  // Call the createChatCompletion endpoint with streaming
  try {
    console.log("\n--------------------------------");
    console.log("AI Chat Completion Streaming");
    console.log("--------------------------------");
    console.log("Sending request...");
    console.log(`"What is the all time high price of Bitcoin?"`);

    // Call the createChatCompletion endpoint
    const response = await client.ai.createChatCompletion({
      messages: [
        {
          role: "user",
          content: "What is the all time high price of Bitcoin?",
        },
      ],
      verbosity: "succinct",
      response_format: "plaintext",
      inline_citations: false,
      stream: true,
    });

    // Treat the combined streamed Server-Sent Events (SSE) chunks as a single string
    const rawResponse = response as unknown as string;
    const chunks = rawResponse.split("\n\n").filter((line) => line.trim() !== "");

    let content = "";
    for (const chunk of chunks) {
      const dataMatch = chunk.match(/data: ({.*})/);
      if (dataMatch) {
        try {
          const data = JSON.parse(dataMatch[1]);
          if (data.data?.messages?.[0]?.delta?.content) {
            content += data.data.messages[0].delta.content;
          }
        } catch (e) {
          console.error("Error parsing SSE message:", e);
        }
      }
    }
    console.log(content);
  } catch (error) {
    console.error("Error calling createChatCompletion:", error);
  }

  // Entity Extraction
  try {
    console.log("\n--------------------------------");
    console.log("AI Entity Extraction");
    console.log("--------------------------------");
    console.log("Sending request...");
    console.log(`"Ethereum founder Vitalik Buterin announced..."`);

    const resp = await client.ai.extractEntities({
      content: "Ethereum founder Vitalik Buterin announced...",
      entityTypes: ["person", "project"],
    });

    console.log("Response received:");
    for (const entity of resp.extractedEntities) {
      if (entity.selectedEntity) {
        console.log(JSON.stringify(entity.selectedEntity, null, 2));
      }
    }
  } catch (error) {
    console.error("Error calling extractEntities:", error);
  }

  // OpenAI Chat Completion
  try {
    console.log("\n--------------------------------");
    console.log("OpenAI Chat Completion");
    console.log("--------------------------------");
    console.log("Sending request...");
    console.log(`"What are the key differences between Bitcoin and Ethereum?"`);

    // Call the createChatCompletionOpenAI endpoint
    const response = await client.ai.createChatCompletionOpenAI({
      messages: [
        {
          role: "user",
          content: "What are the key differences between Bitcoin and Ethereum?",
        },
      ],
      verbosity: "succinct",
      response_format: "plaintext",
      inline_citations: false,
      stream: false,
    });

    console.log("Response received:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error calling createChatCompletionOpenAI:", error);
  }
}

main().catch(console.error);
