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
 * Get all assets with their All-Time High (ATH) information
 */
export async function getAssetsATHInfo() {
  try {
    // Retrieve all assets
    const response = await client.asset.getAssetDetails({});

    // Sort assets by percentDownFromAllTimeHigh
    const sortedAssets = response.sort((a, b) => {
      const aDownPercent = a.allTimeHigh?.percentDownFromAllTimeHigh ?? 100;
      const bDownPercent = b.allTimeHigh?.percentDownFromAllTimeHigh ?? 100;
      return aDownPercent - bDownPercent;
    });

    // Create a table to display ATH data
    const t = new Table({
      columns: [
        { name: "Name", alignment: "left" },
        { name: "Symbol", alignment: "left" },
        { name: "ATH Date", alignment: "left" },
        { name: "ATH Price", alignment: "right" },
        { name: "Current Price", alignment: "right" },
        { name: "Down from ATH", alignment: "right" },
        { name: "Up to recover ATH", alignment: "right" },
      ],
    });

    // Filter for assets with valid ATH data and add them to the table
    const assetsWithValidAth = sortedAssets.filter((asset) => asset.allTimeHigh?.allTimeHigh);

    // Limit to at most 20 rows for console output
    const dataToDisplay = assetsWithValidAth.slice(0, 20);

    for (const asset of dataToDisplay) {
      const athDate = asset.allTimeHigh?.allTimeHighDate ? new Date(asset.allTimeHigh.allTimeHighDate).toLocaleDateString() : "N/A";
      const athPrice = asset.allTimeHigh?.allTimeHigh
        ? asset.allTimeHigh.allTimeHigh.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        : "N/A";
      const currentPrice = asset.marketData?.priceUsd
        ? asset.marketData.priceUsd.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        : "N/A";
      const downFromAth = asset.allTimeHigh?.percentDownFromAllTimeHigh ? `${asset.allTimeHigh.percentDownFromAllTimeHigh.toFixed(2)}%` : "N/A";

      let upToRecover = "N/A";
      if (asset.allTimeHigh?.percentDownFromAllTimeHigh) {
        const percentDown = asset.allTimeHigh.percentDownFromAllTimeHigh;
        const recoveryPercentage = (100 / (1 - percentDown / 100) - 100).toFixed(2);
        upToRecover = `${recoveryPercentage}%`;
      }

      t.addRow({
        Name: asset.name,
        Symbol: asset.symbol,
        "ATH Date": athDate,
        "ATH Price": athPrice,
        "Current Price": currentPrice,
        "Down from ATH": downFromAth,
        "Up to recover ATH": upToRecover,
      });
    }
    t.printTable();

    if (assetsWithValidAth.length > 20) {
      console.log(`... and ${assetsWithValidAth.length - 20} more rows not displayed.`);
    }

    console.log(`Total assets retrieved: ${response.length}`);
    return response;
  } catch (error) {
    console.error("Error fetching ATH data:", error);
    throw error;
  }
}

/**
 * Main function to run the ATH example
 */
async function main() {
  console.log("Fetching All-Time High (ATH) information for assets...");
  try {
    const response = await getAssetsATHInfo();
    console.log(`Successfully retrieved ATH data for ${response.length} assets.`);
  } catch (error) {
    console.error("Error running ATH example:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
