import { MessariClient } from "@messari-kit/api";
import type {
  getAllEventsParameters,
  getEventAndHistoryParameters,
  getAllAssetsParameters,
  Asset,
  EventHistory,
} from "@messari-kit/types";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variable
const API_KEY = process.env.MESSARI_API_KEY;

// Check if API key is available
if (!API_KEY) {
  console.error("Error: MESSARI_API_KEY environment variable is not set.");
  console.error(
    "Please create a .env file with your API key or set it in your environment."
  );
  process.exit(1);
}

// Initialize the Messari client
const client = new MessariClient({
  apiKey: API_KEY,
});

async function getAllEvents() {
  try {
    // Define the parameters for the getAllEvents endpoint
    const params: getAllEventsParameters = {
      limit: 5,
      page: 1,
      importance: ["High"], // This should be an array of strings
    };

    // Call the getAllEvents endpoint with pagination
    const paginatedEvents = await client.intel.getAllEvents(params);

    // Display pagination metadata
    console.log("Pagination metadata:", paginatedEvents.metadata);
    console.log(`Total events: ${paginatedEvents.metadata?.totalRows}`);
    console.log(`Total pages: ${paginatedEvents.metadata?.totalPages}`);

    // Display the first page of events
    console.log("\nPage 1 events:");
    displayEvents(paginatedEvents.data);

    // Get the second page if available
    if (
      paginatedEvents.metadata?.page &&
      paginatedEvents.metadata?.totalPages &&
      paginatedEvents.metadata?.page < paginatedEvents.metadata?.totalPages
    ) {
      console.log("\nFetching page 2...");
      const page2Params = { ...params, page: 2 };
      const page2 = await client.intel.getAllEvents(page2Params);
      console.log(
        `Page ${page2.metadata?.page} of ${page2.metadata?.totalPages}`
      );
      displayEvents(page2.data);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

async function getEventDetails(eventId: string) {
  try {
    console.log(`\nFetching details for event ID: ${eventId}`);

    // Define the parameters for the getEventAndHistory endpoint
    const params: getEventAndHistoryParameters = {
      eventId: eventId,
    };

    // Call the getById method which internally uses the getEventAndHistory operation
    const eventDetails = await client.intel.getById(params);

    // Display the event details
    console.log("\nEvent details:");
    console.log(`Name: ${eventDetails.event.eventName}`);
    console.log(`Description: ${eventDetails.event.eventDetails}`);
    console.log(`Importance: ${eventDetails.event.importance}`);
    console.log(`Date: ${eventDetails.event.eventDate || "No date available"}`);

    // Display the event history
    console.log("\nEvent history:");
    eventDetails.eventHistory.forEach(
      (historyItem: EventHistory, index: number) => {
        console.log(`${index + 1}. Status: ${historyItem.status}`);
        console.log(`   Date: ${historyItem.submissionDate}`);
        console.log(
          `   Details: ${historyItem.updateDetails || "No details available"}`
        );
        console.log();
      }
    );
  } catch (error) {
    console.error(`Error fetching event details for ID ${eventId}:`, error);
  }
}

async function getAllAssets() {
  try {
    console.log("\nFetching assets...");

    // Define the parameters for the getAllAssets endpoint
    const params: getAllAssetsParameters = {
      limit: 10,
      page: 1,
    };

    // Call the getAllAssets endpoint
    const paginatedAssets = await client.intel.getAllAssets(params);

    // Display pagination metadata
    console.log("Pagination metadata:", paginatedAssets.metadata);
    console.log(`Total assets: ${paginatedAssets.metadata?.totalRows}`);
    console.log(`Total pages: ${paginatedAssets.metadata?.totalPages}`);

    // Display the assets
    console.log("\nAssets:");
    paginatedAssets.data.forEach((asset: Asset, index: number) => {
      console.log(`${index + 1}. ${asset.name} (${asset.symbol})`);
    });
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
}

// Helper function to display events
// biome-ignore lint/suspicious/noExplicitAny: It's chill
function displayEvents(events: any[]) {
  events.forEach((event, index: number) => {
    console.log(`${index + 1}. ${event.eventName}`);
    console.log(`   Importance: ${event.importance}`);
    console.log(`   Date: ${event.eventDate || "No date available"}`);
    console.log(`   Description: ${event.eventDetails}`);
    console.log();
  });
}

async function main() {
  console.log("1. Getting all events with pagination...");
  // Store the events response to extract a real event ID
  const eventsResponse = await getAllEventsAndReturnResponse();

  // Check if we have events to get details for
  if (eventsResponse?.data && eventsResponse.data.length > 0) {
    console.log("\n2. Getting details for a specific event...");
    // Use the ID from the first event in the response
    const eventId = eventsResponse.data[0].id;
    console.log(`Using event ID from response: ${eventId}`);
    await getEventDetails(eventId);
  } else {
    console.log(
      "\n2. Skipping event details - no events found in the response"
    );
  }

  console.log("\n3. Getting all assets...");
  await getAllAssets();
}

// Modified version of getAllEvents that returns the response
async function getAllEventsAndReturnResponse() {
  try {
    // Define the parameters for the getAllEvents endpoint
    const params: getAllEventsParameters = {
      limit: 5,
      page: 1,
      importance: ["High"], // This should be an array of strings
    };

    // Call the getAllEvents endpoint with pagination
    const paginatedEvents = await client.intel.getAllEvents(params);

    // Display pagination metadata
    console.log("Pagination metadata:", paginatedEvents.metadata);
    console.log(`Total events: ${paginatedEvents.metadata?.totalRows}`);
    console.log(`Total pages: ${paginatedEvents.metadata?.totalPages}`);

    // Display the first page of events
    console.log("\nPage 1 events:");
    displayEvents(paginatedEvents.data);

    // Get the second page if available
    if (
      paginatedEvents.metadata?.page &&
      paginatedEvents.metadata?.totalPages &&
      paginatedEvents.metadata?.page < paginatedEvents.metadata?.totalPages
    ) {
      console.log("\nFetching page 2...");
      const page2Params = { ...params, page: 2 };
      const page2 = await client.intel.getAllEvents(page2Params);
      console.log(
        `Page ${page2.metadata?.page} of ${page2.metadata?.totalPages}`
      );
      displayEvents(page2.data);
    }

    // Return the first page response so we can use an event ID
    return paginatedEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
}

main().catch(console.error);
