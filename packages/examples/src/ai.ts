import { MessariClient } from "../../api/dist";
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
    console.log("\n--------------------------------");
    console.log("AI Chat Completion");
    console.log("--------------------------------");
    console.log("Sending request...");
    console.log(`"What companies have both paradigm and multicoin on their cap table?"`);

    // Call the createChatCompletion endpoint
    const response = await client.ai.createChatCompletion({
      messages: [
        {
          role: "user",
          content: "What companies have both Paradigm and a16z on their cap table?",
        },
      ],
    });

    const assistantMessage = response.messages[0].content;
    console.log(assistantMessage);
  } catch (error) {
    console.error("Error calling createChatCompletion:", error);
  }

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
