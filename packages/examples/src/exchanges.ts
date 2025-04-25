import { MessariClient, LogLevel } from "@messari/sdk";
import { Table } from "console-table-printer";
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

// Initialize the client with your API key
const client = new MessariClient({ apiKey: API_KEY });

async function getTop5CentralizedExchanges() {
  try {
    // Retrieve all assets with details
    const response = await client.exchanges.getExchanges({ type: "centralized", typeRankCutoff: 5 });

    // Create a table to display ROI data
    const t = new Table({
      columns: [
        { name: "Name", alignment: "left" },
        { name: "Type", alignment: "left" },
        { name: "TypeRank30D", alignment: "right" },
        { name: "Country", alignment: "right" },
        { name: "Volume", alignment: "right" },
      ],
    });

    // Limit to at most 20 rows for console output
    const exchanges = response.data;
    if (!exchanges) {
      console.log("No exchanges found");
      return;
    }

    for (const ex of exchanges) {
      t.addRow({
        Name: ex.name,
        Type: ex.type,
        TypeRank30D: ex.typeRank30D,
        Country: ex.country,
        Volume: ex.metrics.volume24Hour,
      });
    }
    t.printTable();
    console.log("Successfully retrieved top 5 centralized exchanges.");
    return response;
  } catch (error) {
    console.error("Error fetching ROI data:", error);
    throw error;
  }
}

export async function getExchangeMetrics() {
  try {
    const catalog = await client.exchanges.getExchangeMetrics();
    const t = new Table({
      columns: [
        { name: "Slug", alignment: "right" },
        { name: "Granularities", alignment: "left" },
        { name: "Fields", alignment: "left" },
      ],
    });
    for (const metric of catalog.datasets) {
      t.addRow({
        Slug: metric.slug,
        Granularities: metric.granularities.join(", "),
        Fields: metric.metrics
          .map((metric) => metric.name)
          .slice(0, 3)
          .join(", "),
      });
    }
    t.printTable();
    return catalog;
  } catch (error) {
    console.error("Error fetching Exchange Metrics:", error);
    throw error;
  }
}

export async function getExchangeTimeseriesWithGranularity(slug: string, datasetSlug: string, granularity: string) {
  try {
    const response = await client.exchanges.getExchangeTimeseries({
      entityIdentifier: slug,
      datasetSlug: datasetSlug,
      granularity: granularity,
      start: "2025-01-01T00:00:00Z",
      end: "2025-01-07T00:00:00Z",
    });
    // Access the points array from the properly typed response
    const points = response.data.points || [];
    const dataLength = points.length;

    console.log(`Retrieved ${dataLength} timeseries data points for ${slug}`);
    console.log(`Dataset: ${datasetSlug}, Granularity: ${granularity}`);
    console.log("\nSample data points:");
    if (points.length > 0) {
      const t = new Table({
        columns: [
          { name: "Timestamp", alignment: "right" },
          { name: "OpenInterest", alignment: "left" },
        ],
      });
      // Display only the first 2 points for brevity
      for (const point of points.slice(0, 5)) {
        t.addRow({
          Timestamp: new Date(point[0] * 1000).toLocaleDateString(),
          OpenInterest: `$${point[1].toLocaleString()}`,
        });
      }
      t.printTable();
    } else {
      console.log("No points available in the response data.");
    }
    return response;
  } catch (error) {
    console.error("Error fetching Asset Timeseries:", error);
    throw error;
  }
}

/**
 * Main function to run the ROI example
 */
async function main() {
  try {
    console.log("Fetching Top 5 Centralized Exchanges...");
    await getTop5CentralizedExchanges();
    console.log("Fetching Exchange Metrics...");
    await getExchangeMetrics();
    console.log("Fetching Exchange Timeseries with Granularity...");
    await getExchangeTimeseriesWithGranularity("binance", "futures-open-interest", "1d");
  } catch (error) {
    console.error("Error running Exchanges example:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
