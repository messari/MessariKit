import { MessariClient } from "@messari-kit/api";
import { intelEvent, intelAsset, intelEventHistory } from "@messari-kit/types";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variables
const apiKey = process.env.MESSARI_API_KEY;

if (!apiKey) {
  console.error("Please set MESSARI_API_KEY in your environment variables");
  process.exit(1);
}

// Initialize the Messari client
const client = new MessariClient({
  apiKey,
});

// Example 1: Get all events with pagination
async function getAllEvents() {
  try {
    // Get the first page of events
    const eventsResponse = await client.intel.getAllEvents({
      limit: 5,
      page: 1,
      importance: ["High"],
    });

    console.log("Events (Page 1):");
    console.log(`Total events: ${eventsResponse.metadata?.totalRows}`);
    console.log(`Total pages: ${eventsResponse.metadata?.totalPages}`);

    // Print the events
    if (Array.isArray(eventsResponse.data)) {
      eventsResponse.data.forEach((event: intelEvent) => {
        console.log(`- ${event.eventName} (${event.importance})`);
        console.log(
          `  Primary assets: ${event.primaryAssets
            .map((asset: intelAsset) => asset.symbol)
            .join(", ")}`
        );
        console.log(`  Status: ${event.status}`);
        console.log(`  Category: ${event.category}`);
        console.log("  ---");
      });
    }

    // Get the next page
    if (
      eventsResponse.metadata &&
      eventsResponse.metadata.page < eventsResponse.metadata.totalPages
    ) {
      const page2Response = await client.intel.getAllEvents({
        limit: 5,
        page: 2,
        importance: ["High"],
      });

      console.log("\nEvents (Page 2):");

      if (Array.isArray(page2Response.data)) {
        page2Response.data.forEach((event: intelEvent) => {
          console.log(`- ${event.eventName} (${event.importance})`);
          console.log(
            `  Primary assets: ${event.primaryAssets
              .map((asset: intelAsset) => asset.symbol)
              .join(", ")}`
          );
          console.log("  ---");
        });
      }
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

// Example 2: Get a specific event and its history
async function getEventDetails(eventId: string) {
  try {
    const eventResponse = await client.intel.getEventAndHistory({ eventId });

    const event = eventResponse.event;
    const history = eventResponse.eventHistory;

    console.log("\nEvent Details:");
    console.log(`Name: ${event.eventName}`);
    console.log(`Status: ${event.status}`);
    console.log(`Importance: ${event.importance}`);
    console.log(`Category: ${event.category} / ${event.subcategory}`);
    console.log(
      `Primary assets: ${event.primaryAssets
        .map((asset) => asset.symbol)
        .join(", ")}`
    );
    console.log(`Details: ${event.eventDetails}`);

    console.log("\nEvent History:");
    if (Array.isArray(history) && history.length > 0) {
      history.forEach((entry: intelEventHistory) => {
        console.log(
          `- ${new Date(entry.submissionDate).toLocaleDateString()}: ${
            entry.status
          } (${entry.importance})`
        );
        if (entry.updateDetails) {
          console.log(`  Update: ${entry.updateDetails}`);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
  }
}

// Example 3: Get all assets
async function getAllAssets() {
  try {
    const assetsResponse = await client.intel.getAllAssets({});

    console.log("\nAssets:");
    console.log(`Total assets: ${assetsResponse.metadata?.totalRows}`);

    if (Array.isArray(assetsResponse.data)) {
      assetsResponse.data.forEach((asset: intelAsset) => {
        console.log(`- ${asset.name} (${asset.symbol})`);
      });
    }
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
}

// Run the examples
async function runExamples() {
  await getAllEvents();

  // For getEventDetails, you would need a valid event ID
  // Uncomment and replace with a valid event ID
  // await getEventDetails("your-event-id");

  await getAllAssets();
}

runExamples().catch(console.error);
