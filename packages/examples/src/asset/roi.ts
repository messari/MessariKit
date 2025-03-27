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

/**
 * Get all assets with their Return On Investment (ROI) information
 */
export async function getAssetsROIInfo() {
  try {
    // Retrieve all assets with details
    const response = await client.asset.getAssetsV2ROI({ limit: 20 });

    // Create a table to display ROI data
    const t = new Table({
      columns: [
        { name: "Name", alignment: "left" },
        { name: "Symbol", alignment: "left" },
        { name: "24h", alignment: "right" },
        { name: "7d", alignment: "right" },
        { name: "30d", alignment: "right" },
        { name: "YTD", alignment: "right" },
        { name: "1y", alignment: "right" },
      ],
    });

    // Filter for assets with valid ROI data
    const assetsWithValidROI = response.data.filter((asset) => asset.returnOnInvestment);

    // Limit to at most 20 rows for console output
    const dataToDisplay = assetsWithValidROI.slice(0, 20);

    for (const asset of dataToDisplay) {
      // Format the ROI data with proper coloring
      const roi = asset.returnOnInvestment;
      const h24 = roi?.priceChange24h ? `${roi.priceChange24h.toFixed(2)}%` : "N/A";
      const d7 = roi?.priceChange7d ? `${roi.priceChange7d.toFixed(2)}%` : "N/A";
      const d30 = roi?.priceChange30d ? `${roi.priceChange30d.toFixed(2)}%` : "N/A";
      const ytd = roi?.priceChangeYTD ? `${roi.priceChangeYTD.toFixed(2)}%` : "N/A";
      const y1 = roi?.priceChange1y ? `${roi.priceChange1y.toFixed(2)}%` : "N/A";
      t.addRow({
        Name: asset.name,
        Symbol: asset.symbol,
        "24h": h24,
        "7d": d7,
        "30d": d30,
        "YTD": ytd,
        "1y": y1,
      });
    }
    t.printTable();

    if (assetsWithValidROI.length > 20) {
      console.log(`... and ${assetsWithValidROI.length - 20} more rows not displayed.`);
    }

    console.log(`Total assets retrieved: ${response.data.length}`);
    return response;
  } catch (error) {
    console.error("Error fetching ROI data:", error);
    throw error;
  }
}

/**
 * Main function to run the ROI example
 */
async function main() {
  console.log("Fetching Return On Investment (ROI) information for assets...");
  try {
    const response = await getAssetsROIInfo();
    console.log(`Successfully retrieved ROI data for ${response.data.length} assets.`);
  } catch (error) {
    console.error("Error running ROI example:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
