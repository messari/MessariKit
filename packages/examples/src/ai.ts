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

// Get command line arguments
const args = process.argv.slice(2);
const useStreaming = args.includes("stream");

async function main() {
  // OpenAI Chat Completion
  try {
    console.log("\n--------------------------------");
    console.log("OpenAI Chat Completion (Streaming)");
    console.log("--------------------------------");
    console.log("Sending request...");
    console.log(`"What are the key differences between Bitcoin and Ethereum?"`);

    if (useStreaming) {
      // Call the createChatCompletionOpenAI endpoint
      const response = await client.ai.createChatCompletionStream({
        messages: [
          {
            role: "user",
            content: "What are the key differences between Bitcoin and Ethereum?",
          },
        ],
        verbosity: "succinct",
        response_format: "plaintext",
        inline_citations: false,
      });

      // Process the stream and progressively print out the text
      process.stdout.write("Response: ");
      for await (const chunk of response) {
        if (chunk.choices.length > 0 && chunk.choices[0].delta?.content) {
          const content = chunk.choices[0].delta.content;
          process.stdout.write(content);
        }
      }
      process.stdout.write("\n");

      console.log("\n");
    } else {
      const response = await client.ai.createChatCompletion({
        messages: [
          {
            role: "user",
            content: "What are the key differences between Bitcoin and Ethereum?",
          },
        ],
        verbosity: "succinct",
        response_format: "plaintext",
        inline_citations: false,
      });
      console.log("Response received:");
      console.log(response);
    }
  } catch (error) {
    console.error("Error calling createChatCompletionOpenAI:", error);
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
}

main().catch(console.error);
