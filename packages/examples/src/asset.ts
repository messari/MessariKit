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

const newAssetTable = () => {
  const t = new Table({
    disabledColumns: ["Slug"], // Hide the slug column because some are super long
    columns: [
      { name: "Rank", alignment: "right" },
      { name: "Name", alignment: "left" },
      { name: "Symbol", alignment: "left" },
      { name: "Slug", alignment: "left" },
      { name: "Category", alignment: "left" },
      { name: "Sector", alignment: "left" },
      { name: "Tags", alignment: "left", maxLen: 40 },
      { name: "Asset ID", alignment: "left" },
    ],
  });
  return t;
};

/**
 * Example 1: Basic usage - Get all assets with default pagination
 */
async function getAllAssetsBasic() {
  try {
    const response = await client.asset.getAssetList();

    console.log(`Retrieved ${response.data.length} assets out of ${response.metadata?.total} total assets. Top 10 Assets:`);
    const t = newAssetTable();
    for (const asset of response.data.slice(0, 10)) {
      t.addRow({
        "Rank": asset.rank,
        "Name": asset.name,
        "Symbol": asset.symbol,
        "Slug": asset.slug,
        "Category": asset.category,
        "Sector": asset.sector,
        "Tags": asset.tags.join(", "),
        "Asset ID": asset.id,
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
}

/**
 * Example 2: Filtering assets by symbol
 */
async function getAssetsBySymbol(symbols: string[]) {
  try {
    const response = await client.asset.getAssetList({
      symbol: symbols.join(","),
    });

    console.log(`Retrieved ${response.data.length} assets matching symbols: ${symbols.join(", ")}`);
    const t = newAssetTable();
    for (const asset of response.data) {
      t.addRow({
        "Rank": asset.rank,
        "Name": asset.name,
        "Symbol": asset.symbol,
        "Slug": asset.slug,
        "Category": asset.category,
        "Sector": asset.sector,
        "Tags": asset.tags.join(", "),
        "Asset ID": asset.id,
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error("Error fetching assets by symbol:", error);
    throw error;
  }
}

/**
 * Example 3: Filtering assets by category and using pagination
 */
async function getAssetsByCategory(category: string, page = 1, limit = 20) {
  try {
    const response = await client.asset.getAssetList({
      category,
      page,
      limit,
    });

    console.log(`Retrieved ${response.data.length} assets with category=${category}`);
    const t = newAssetTable();
    for (const asset of response.data) {
      t.addRow({
        "Rank": asset.rank,
        "Name": asset.name,
        "Symbol": asset.symbol,
        "Slug": asset.slug,
        "Category": asset.category,
        "Sector": asset.sector,
        "Tags": asset.tags.join(", "),
        "Asset ID": asset.id,
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error(`Error fetching ${category} assets:`, error);
    throw error;
  }
}

/**
 * Example 4: Combining multiple filters
 */
async function getAssetsWithMultipleFilters(sector: string, tags: string[]) {
  try {
    const response = await client.asset.getAssetList({
      sector: sector,
      tags: tags.join(","),
      limit: 25,
    });

    if (response.data.length === 0) {
      console.log("No assets found with the given filters");
      return;
    }

    console.log(`Retrieved ${response.data.length} assets with sector=${sector} and tags=[${tags.join(", ")}]`);
    const t = newAssetTable();
    for (const asset of response.data) {
      t.addRow({
        "Rank": asset.rank,
        "Name": asset.name,
        "Symbol": asset.symbol,
        "Slug": asset.slug,
        "Category": asset.category,
        "Sector": asset.sector,
        "Tags": asset.tags.join(", "),
        "Asset ID": asset.id,
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error("Error fetching filtered assets:", error);
    throw error;
  }
}

async function main() {
  // 1. Basic Usage
  await getAllAssetsBasic();

  // 2. Filtering by Symbol
  await getAssetsBySymbol(["BTC", "ETH", "SOL"]);

  // 3. Filtering by Category
  await getAssetsByCategory("Networks");

  // 4. Using Multiple Filters (sectors and tags)
  await getAssetsWithMultipleFilters("Stablecoins", ["Decentralized Issuer", "U.S. Dollar Stablecoin"]);
}

main().catch(console.error);
