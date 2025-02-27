import { MessariClient } from "@messari-kit/api";
import { printTable } from "console-table-printer";
import type { getExchangeRecapParameters, getProjectRecapParameters } from "@messari-kit/types";
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
      console.log(`Summary: \n${recap.summary?.summary}`);

      const rows = recaps.map((r) => ({
        "Date": r.recapDate,
        "Period": r.timePeriod,
        "tvl_usd": r.networkMetricsData?.tvl_usd,
        "tvl_percent_change": r.networkMetricsData?.tvl_percent_change,
        "active_addresses": r.networkMetricsData?.active_addresses,
        "fee_revenue": r.networkMetricsData?.fee_revenue,
      }));
      printTable(rows);
    }
  } catch (error) {
    console.error("Error calling getProjectRecap:", error);
  }

  // Get Exchange Rankings
  try {
    const exchangeRankings = await client.recaps.getExchangeRankingsRecap();
    console.log("\n--------------------------------");
    console.log("Overall Exchanges Recap:");
    console.log("--------------------------------");
    console.log(`Recap Date & Period: ${exchangeRankings.recapDate} (${exchangeRankings.recapPeriod})`);
    if (exchangeRankings.performanceRecap) {
      const data = exchangeRankings.performanceRecap?.data;
      if (data?.topExchanges) {
        // biome-ignore lint/suspicious/noExplicitAny: Will improve type safety
        const rows: Record<string, any>[] = [];
        for (const [i, row] of data.topExchanges.entries()) {
          if (i > 5) break;
          rows.push({
            "exchangeId": row.id,
            "exchangeName": row.name,
            "exchangeSlug": row.slug,
            "exchangeType": row.type,
          });
        }
        printTable(rows);
      }
    }
    if (exchangeRankings.recapBrief) {
      for (const [i, row] of exchangeRankings.recapBrief.entries()) {
        if (i === 0) {
          console.log(row.summary);
          console.log("\nRecap Items:");
          continue;
        }
        if (i > 2) break;
        console.log(`${i}. ${row.summary}`);
      }
    }
  } catch (error) {
    console.error("Error calling getExchangeRankingsRecap:", error);
  }

  // // Get Individual Exchange Recap
  try {
    const binanceExchangeId = "d8b0ea44-1963-451e-ac37-aead4ba3b4c7";
    const params: getExchangeRecapParameters = {
      exchange_id: binanceExchangeId,
    };
    const exchangeRecap = await client.recaps.getExchangeRecap(params);
    console.log("\n--------------------------------");
    console.log("Individual Exchange Recap (Binance)");
    console.log("--------------------------------");
    console.log(`Recap Date & Period: ${exchangeRecap.recapDate} (${exchangeRecap.recapPeriod})`);
    if (exchangeRecap.performanceRecap) {
      console.log("Performance Summary:\n", exchangeRecap.performanceRecap?.summary);
      console.log("Performance Data:");
      printTable([
        {
          "exchangeId": exchangeRecap.performanceRecap?.data?.exchangeId,
          "exchangeName": exchangeRecap.performanceRecap?.data?.exchangeName,
          "exchangeType": exchangeRecap.performanceRecap?.data?.exchangeType,
          "region": exchangeRecap.performanceRecap?.data?.region,
          "last30DaysVolume": exchangeRecap.performanceRecap?.data?.last30DaysVolume,
        },
      ]);
    }
  } catch (error) {
    console.error("Error calling getExchangeRecap:", error);
  }
}
// Run the example
runRecapsExample();
