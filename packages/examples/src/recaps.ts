import { MessariClient } from "@messari-kit/api";
import { getExchangeRankingsRecapParameters, getExchangeRecapParameters, getProjectRecapParameters } from "@messari-kit/types";
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
  // Optional: Override the base URL if needed
  // baseUrl: "https://api.messari.io",
});



async function runRecapsExample() {
  // Get the project recap for Bitcoin
  try {
    const bitcoinProjectId = "9793eae6-f374-46b4-8764-c2d224429791";
    const params: getProjectRecapParameters = { project_id: bitcoinProjectId };
    const recaps = await client.recaps.getProjectRecap(params);

    console.log("\n--------------------------------");
    console.log("Project Recap");
    console.log("--------------------------------");
    if (recaps.length > 0) {
      const recap = recaps[0];
      console.log(`Date & Period: ${recap.recapDate} (${recap.timePeriod})`);
      console.log(`Summary: \n${recap.summary?.summary}`);
      console.log("Network Metrics: \n", recap.networkMetricsData)
    }
  } catch (error) {
    console.error("Error calling getProjectRecap:", error);
  }

  // Get Exchange Rankings
  try {
    const params: getExchangeRankingsRecapParameters = {}
    const exchangeRankings = await client.recaps.getExchangeRankingsRecap(params);
    console.log("\n--------------------------------");
    console.log("Overall Exchanges Recap:");
    console.log("--------------------------------");
    console.log(`Recap Date & Period: ${exchangeRankings.recapDate} (${exchangeRankings.recapPeriod})`);
    if (exchangeRankings.performanceRecap) {
      console.log("Performance Summary:\n", exchangeRankings.performanceRecap?.summary);
    }
  } catch (error) {
    console.error("Error calling getExchangeRankingsRecap:", error);
  }

  // Get Individual Exchange Recap
  try {
    const binanceExchangeId = "d8b0ea44-1963-451e-ac37-aead4ba3b4c7";
    const params: getExchangeRecapParameters = {
      exchange_id: binanceExchangeId
    }
    const exchangeRecap = await client.recaps.getExchangeRecap(params);
    console.log("\n--------------------------------");
    console.log(`Individual Exchange Recap (Binance)`);
    console.log("--------------------------------");
    console.log(`Recap Date & Period: ${exchangeRecap.recapDate} (${exchangeRecap.recapPeriod})`);
    if (exchangeRecap.performanceRecap) {
      console.log("Performance Summary:\n", exchangeRecap.performanceRecap?.summary);
      console.log("Performance Data:\n", exchangeRecap.performanceRecap?.data);
    }

  } catch (error) {
    console.error("Error calling getExchangeRecap:", error);
  }
}
// Run the example
runRecapsExample();
