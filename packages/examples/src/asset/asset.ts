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
 * Example 1: Get assets with V2 API including coverage information
 */
async function getAssetsV2WithCoverage() {
  try {
    const response = await client.asset.getAssetsV2({
      hasMarketData: true,
      limit: 10,
    });

    console.log(`Retrieved ${response.length} assets with market data coverage`);

    const t = new Table({
      columns: [
        { name: "Name", alignment: "left" },
        { name: "Symbol", alignment: "left" },
        { name: "Category", alignment: "left" },
        { name: "Has Diligence", alignment: "center" },
        { name: "Has Intel", alignment: "center" },
        { name: "Has Market Data", alignment: "center" },
        { name: "Has News", alignment: "center" },
        { name: "Has Research", alignment: "center" },
      ],
    });

    // Limit to at most 20 rows for console output
    const dataToDisplay = response.slice(0, 20);

    for (const asset of dataToDisplay) {
      t.addRow({
        Name: asset.name,
        Symbol: asset.symbol,
        Category: asset.category,
        "Has Diligence": asset.hasDiligence ? "✅" : "❌",
        "Has Intel": asset.hasIntel ? "✅" : "❌",
        "Has Market Data": asset.hasMarketData ? "✅" : "❌",
        "Has News": asset.hasNews ? "✅" : "❌",
        "Has Research": asset.hasResearch ? "✅" : "❌",
      });
    }
    t.printTable();

    if (response.length > 20) {
      console.log(`... and ${response.length - 20} more rows not displayed.`);
    }

    return response;
  } catch (error) {
    console.error("Error fetching V2 assets with coverage:", error);
    throw error;
  }
}

/**
 * Example 2: Filtering assets by slugs
 */
async function getAssetsBySlugs(slugs: string[]) {
  try {
    const response = await client.asset.getAssetDetails({
      slugs: slugs.join(","),
    });
    const assets = response;

    console.log(`Retrieved ${assets.length} assets matching symbols: ${slugs.join(", ")}`);
    const t = new Table({
      columns: [
        { name: "Rank", alignment: "right" },
        { name: "Name", alignment: "left" },
        { name: "Symbol", alignment: "left" },
        { name: "Category", alignment: "left" },
        { name: "Sector", alignment: "left" },
        { name: "Price", alignment: "left" },
        { name: "FDV", alignment: "left" },
      ],
    });
    for (const asset of assets.slice(0, 10)) {
      t.addRow({
        Rank: asset.rank,
        Name: asset.name,
        Symbol: asset.symbol,
        Category: asset.category,
        Sector: asset.sector,
        Price: asset.marketData?.priceUsd?.toLocaleString(),
        FDV: asset.marketData?.marketcap?.fullyDilutedUsd?.toLocaleString(),
      });
    }
    t.printTable();

    return assets;
  } catch (error) {
    console.error("Error fetching assets by symbol:", error);
    throw error;
  }
}

/**
 * Example 3: Filtering assets by category and using pagination
 */
async function getAssetsByCategory(category: string) {
  try {
    const response = await client.asset.getAssetsV2({
      category,
    });

    console.log(`Retrieved ${response.length} assets with category=${category}`);
    const t = newAssetTable();
    for (const asset of response.slice(0, 10)) {
      t.addRow({
        Rank: asset.rank,
        Name: asset.name,
        Symbol: asset.symbol,
        Slug: asset.slug,
        Category: asset.category,
        Sector: asset.sector,
        Tags: asset.tags.join(", "),
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
    const response = await client.asset.getAssetsV2({
      sector: sector,
      tags: tags,
    });

    if (response.length === 0) {
      console.log("No assets found with the given filters");
      return;
    }

    console.log(`Retrieved ${response.length} assets with sector=${sector} and tags=[${tags.join(", ")}]`);
    const t = newAssetTable();
    for (const asset of response.slice(0, 10)) {
      t.addRow({
        Rank: asset.rank,
        Name: asset.name,
        Symbol: asset.symbol,
        Slug: asset.slug,
        Category: asset.category,
        Sector: asset.sector,
        Tags: asset.tags.join(", "),
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

/**
 * Example 5: Get detailed information for specific assets
 */
async function getAssetDetailsBySlug(slugs: string[]) {
  try {
    const response = await client.asset.getAssetDetails({
      slugs: slugs.join(","),
    });

    const assets = response;
    console.log(`Retrieved detailed information for ${assets.length} assets`);

    for (const asset of response) {
      console.log(`\n${asset.name} (${asset.symbol})`);
      console.log(`Category: ${asset.category}`);
      console.log(`Sector: ${asset.sector}`);
      console.log(`Description: ${asset.description?.substring(0, 200) || "N/A"}...`);

      console.log("\nLinks:");
      if (asset.links && asset.links.length > 0) {
        for (const link of asset.links.slice(0, 3)) {
          console.log(`- ${link.name || "Link"}: ${link.url}`);
        }
      } else {
        console.log("No links available");
      }

      console.log("\nMarket Data:");
      if (asset.marketData) {
        console.log(`Price: $${asset.marketData.priceUsd?.toLocaleString() || asset.marketData.priceUsd?.toLocaleString() || "N/A"}`);
        console.log(`Market Cap: $${asset.marketData.marketcap?.circulatingUsd?.toLocaleString() || asset.marketData.marketcap?.toLocaleString() || "N/A"}`);
        console.log(`24h Volume: $${asset.marketData.volume24Hour?.toLocaleString() || asset.marketData.volume24Hour?.toLocaleString() || "N/A"}`);
      } else {
        console.log("No market data available");
      }

      console.log("\nAll-Time High:");
      if (asset.allTimeHigh) {
        const dateValue = asset.allTimeHigh.allTimeHighDate || asset.allTimeHigh.allTimeHighDate;
        const athDate = dateValue ? new Date(dateValue).toLocaleDateString() : "N/A";
        console.log(`Date: ${athDate}`);
        console.log(`Price: $${asset.allTimeHigh.allTimeHighDate?.toLocaleString() || asset.allTimeHigh.allTimeHigh?.toLocaleString() || "N/A"}`);
        console.log(`Down from ATH: ${asset.allTimeHigh.allTimeHighPercentDown?.toFixed(2) || asset.allTimeHigh.allTimeHighPercentDown?.toFixed(2) || "N/A"}%`);
      } else {
        console.log("No ATH data available");
      }

      console.log("\nROI Data:");
      if (asset.returnOnInvestment) {
        console.log(`24h Change: ${asset.returnOnInvestment.priceChange24h?.toFixed(2) || asset.returnOnInvestment.priceChange24h?.toFixed(2) || "N/A"}%`);
        console.log(`7d Change: ${asset.returnOnInvestment.priceChange7d?.toFixed(2) || asset.returnOnInvestment.priceChange7d?.toFixed(2) || "N/A"}%`);
        console.log(`30d Change: ${asset.returnOnInvestment.priceChange30d?.toFixed(2) || asset.returnOnInvestment.priceChange30d?.toFixed(2) || "N/A"}%`);
        console.log(`1y Change: ${asset.returnOnInvestment.priceChange1y?.toFixed(2) || asset.returnOnInvestment.priceChange1y?.toFixed(2) || "N/A"}%`);
      } else {
        console.log("No ROI data available");
      }

      if (assets.length > 1) {
        console.log(`\n${"-".repeat(50)}`);
      }
    }

    return response;
  } catch (error) {
    console.error("Error fetching asset details:", error);
    throw error;
  }
}

/**
 * Example 6: Get timeseries catalog for assets
 */
async function getTimeseriesCatalog() {
  try {
    const response = await client.asset.getAssetsTimeseriesCatalog();
    const datasets = response.datasets;
    console.log(`Retrieved ${datasets.length} timeseries datasets`);

    for (const dataset of datasets.slice(0, 3)) {
      console.log(`\nDataset: ${dataset.slug}`);
      console.log(`Available granularities: ${dataset.granularities.join(", ")}`);
      console.log(
        `Available metrics: ${dataset.metrics
          .slice(0, 3)
          .map((m: { name: string }) => m.name)
          .join(", ")}${dataset.metrics.length > 3 ? "..." : ""}`,
      );
    }

    return response;
  } catch (error) {
    console.error("Error fetching timeseries catalog:", error);
    throw error;
  }
}

async function main() {
  console.log("\n====== 1. Get All Assets With Coverage Example ======");
  const assetsV2WithCoverageResponse = await getAssetsV2WithCoverage();
  console.log(`Retrieved ${assetsV2WithCoverageResponse.length} assets with coverage.`);
  console.log("First 3 assets with coverage:");
  for (const asset of assetsV2WithCoverageResponse.slice(0, 3)) {
    console.log(`${asset.name} (${asset.symbol})`);
  }

  console.log("\n====== 2. Get Assets By Slugs Example ======");
  const assetsBySlugsResponse = await getAssetsBySlugs(["bitcoin"]);
  console.log(`Retrieved ${assetsBySlugsResponse.length} assets by slugs.`);

  console.log("\n====== 3. Get Assets By Category Example ======");
  const assetsByCategoryResponse = await getAssetsByCategory("Networks");
  console.log(`Retrieved ${assetsByCategoryResponse.length} assets by category.`);

  console.log("\n====== 4. Get Assets With Multiple Filters Example ======");
  const assetsWithFiltersResponse = await getAssetsWithMultipleFilters("Smart Contract Platform", ["EVM"]);
  if (assetsWithFiltersResponse) {
    console.log(`Retrieved ${assetsWithFiltersResponse.length} assets with multiple filters.`);
    console.log("First 3 filtered assets:");
    for (const asset of assetsWithFiltersResponse.slice(0, 3)) {
      console.log(`${asset.name} (${asset.symbol})`);
    }
  } else {
    console.log("No data returned for assets with multiple filters.");
  }

  console.log("\n====== 5. Get Asset Details By Slug Example ======");
  const assetDetailsResponse = await getAssetDetailsBySlug(["bitcoin"]);
  console.log(`Retrieved detailed information for ${assetDetailsResponse.length} assets.`);
}

// Only run the main function if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

// Export all functions for potential reuse
export {
  getAssetsBySlugs as getAssetsBySymbol,
  getAssetsByCategory,
  getAssetsWithMultipleFilters,
  getAssetsV2WithCoverage,
  getAssetDetailsBySlug,
  getTimeseriesCatalog,
};
