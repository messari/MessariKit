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

async function getTop5MarketsOnExchange(slug: string) {
  try {
    const response = await client.markets.getMarkets({ exchangeSlug: slug });
    const markets = response.data;

    const t = new Table({
      columns: [
        { name: "Name", alignment: "left" },
        { name: "Exchange", alignment: "left" },
        { name: "BaseAsset", alignment: "left" },
        { name: "QuoteAsset", alignment: "left" },
        { name: "Price24hClose", alignment: "left" },
      ],
    });

    let count = 0;
    for (const market of markets) {
      t.addRow({
        Name: market.id,
        Exchange: market.exchange?.slug,
        BaseAsset: market.baseAsset?.slug,
        QuoteAsset: market.quoteAsset?.slug,
        Price24hClose: market.metrics?.latestPrice24hClose,
      });
      count++;
      if (count >= 5) {
        break;
      }
    }
    t.printTable();
    return response;
  } catch (error) {
    console.error("Error fetching Top 5 Markets:", error);
    throw error;
  }
}
export async function getMarketMetrics() {
  try {
    const catalog = await client.markets.getMarketMetrics();
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
    console.error("Error fetching Markets Metrics:", error);
    throw error;
  }
}

export async function getMarketTimeseriesWithGranularity(slug: string, datasetSlug: string, granularity: string) {
  try {
    const response = await client.markets.getMarketTimeseries({
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
          { name: "Open", alignment: "left" },
          { name: "High", alignment: "left" },
          { name: "Low", alignment: "left" },
        ],
      });
      // Display only the first 2 points for brevity
      for (const point of points.slice(0, 5)) {
        t.addRow({
          Timestamp: new Date(point[0] * 1000).toLocaleDateString(),
          Open: `$${point[1].toLocaleString()}`,
          High: `$${point[2].toLocaleString()}`,
          Low: `$${point[3].toLocaleString()}`,
        });
      }
      t.printTable();
    } else {
      console.log("No points available in the response data.");
    }
    return response;
  } catch (error) {
    console.error("Error fetching Markets Timeseries:", error);
    throw error;
  }
}

/**
 * Main function to run the ROI example
 */
async function main() {
  try {
    console.log("Fetching Top 5 Markets on Binance...");
    await getTop5MarketsOnExchange("binance");
    console.log("Fetching Market Metrics...");
    await getMarketMetrics();
    console.log("Fetching Market Timeseries with Granularity...");
    await getMarketTimeseriesWithGranularity("6057-337656-68", "price", "1d");
  } catch (error) {
    console.error("Error running Markets example:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
