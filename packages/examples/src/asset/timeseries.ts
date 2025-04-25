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
const client = new MessariClient({
  apiKey: API_KEY,
  logLevel: LogLevel.INFO,
});

export async function getAssetsTimeseriesCatalog() {
  try {
    // Retrieve all assets with details
    const catalog = await client.asset.getAssetsTimeseriesCatalog({});

    const t = new Table({
      columns: [
        { name: "Slug", alignment: "right" },
        { name: "Granularities", alignment: "left" },
        { name: "Fields", alignment: "left" },
      ],
    });

    for (const dataset of catalog.datasets) {
      t.addRow({
        Slug: dataset.slug,
        Granularities: dataset.granularities.join(", "),
        Fields: dataset.metrics.map((metric) => metric.name).join(", "),
      });
    }
    t.printTable();
    return catalog;
  } catch (error) {
    console.error("Error fetching ROI data:", error);
    throw error;
  }
}

export async function getAssetTimeseriesWithGranularity(slug: string, datasetSlug: string, granularity: string) {
  try {
    const response = await client.asset.getAssetTimeseriesWithGranularity({
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
          { name: "Close", alignment: "left" },
          { name: "Volume", alignment: "left" },
        ],
      });
      // Display only the first 2 points for brevity
      for (const point of points.slice(0, 5)) {
        t.addRow({
          Timestamp: new Date(point[0] * 1000).toLocaleDateString(),
          Open: `$${point[1].toLocaleString()}`,
          High: `$${point[2].toLocaleString()}`,
          Low: `$${point[3].toLocaleString()}`,
          Close: `$${point[4].toLocaleString()}`,
          Volume: `$${point[5].toLocaleString()}`,
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
 * Main function to run the ATH example
 */
async function main() {
  console.log("Fetching Asset Metrics Catalog...");
  try {
    await getAssetsTimeseriesCatalog();
    console.log("Successfully retrieved Asset Metrics Catalog");
  } catch (error) {
    console.error("Error running Asset Metrics Catalog example:", error);
  }
  console.log("\n\nFetching Asset (Bitcoin) Timeseries (Price) (1d)...");
  try {
    await getAssetTimeseriesWithGranularity("bitcoin", "price", "1d");
    console.log("Successfully retrieved Asset Timeseries");
  } catch (error) {
    console.error("Error running Asset Timeseries example:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
