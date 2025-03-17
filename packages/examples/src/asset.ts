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
  console.error(
    "Please create a .env file with your API key or set it in your environment."
  );
  process.exit(1);
}

// Initialize the client with your API key
const client = new MessariClient({
  apiKey: API_KEY,
  logLevel: LogLevel.INFO,
  baseUrl: "https://api-stage.messari.io",
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

    console.log(
      `Retrieved ${response.data.length} assets out of ${response.metadata?.total} total assets. Top 10 Assets:`
    );
    const t = newAssetTable();
    for (const asset of response.data.slice(0, 10)) {
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

    console.log(
      `Retrieved ${
        response.data.length
      } assets matching symbols: ${symbols.join(", ")}`
    );
    const t = newAssetTable();
    for (const asset of response.data) {
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

    console.log(
      `Retrieved ${response.data.length} assets with category=${category}`
    );
    const t = newAssetTable();
    for (const asset of response.data) {
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
    const response = await client.asset.getAssetList({
      sector: sector,
      tags: tags.join(","),
      limit: 25,
    });

    if (response.data.length === 0) {
      console.log("No assets found with the given filters");
      return;
    }

    console.log(
      `Retrieved ${
        response.data.length
      } assets with sector=${sector} and tags=[${tags.join(", ")}]`
    );
    const t = newAssetTable();
    for (const asset of response.data) {
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
 * Example 5: Get assets with V2 API including coverage information
 */
async function getAssetsV2WithCoverage() {
  try {
    const response = await client.asset.getAssetsV2({
      has_market_data: true,
      limit: 10,
    });

    console.log(
      `Retrieved ${response.data.length} assets with market data coverage`
    );

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

    for (const asset of response.data) {
      t.addRow({
        Name: asset.name,
        Symbol: asset.symbol,
        Category: asset.category,
        "Has Diligence": asset.has_diligence ? "✅" : "❌",
        "Has Intel": asset.has_intel ? "✅" : "❌",
        "Has Market Data": asset.has_market_data ? "✅" : "❌",
        "Has News": asset.has_news ? "✅" : "❌",
        "Has Research": asset.has_research ? "✅" : "❌",
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error("Error fetching V2 assets with coverage:", error);
    throw error;
  }
}

/**
 * Example 6: Get detailed information for specific assets
 */
async function getAssetDetailsBySlug(slugs: string[]) {
  try {
    const response = await client.asset.getAssetDetails({
      slugs: slugs.join(","),
    });

    console.log(`Retrieved detailed information for ${response.length} assets`);

    // Print the complete raw response for debugging
    console.log("=== RAW RESPONSE ===");
    console.log(JSON.stringify(response, null, 2));
    console.log("=== END RAW RESPONSE ===");

    for (const asset of response) {
      console.log(`\n${asset.name} (${asset.symbol})`);
      console.log(`Category: ${asset.category}`);
      console.log(`Sector: ${asset.sector}`);
      console.log(
        `Description: ${asset.description?.substring(0, 200) || "N/A"}...`
      );

      console.log(`\nLinks:`);
      if (asset.links && asset.links.length > 0) {
        for (const link of asset.links.slice(0, 3)) {
          console.log(`- ${link.name || link.type || "Link"}: ${link.url}`);
        }
      } else {
        console.log("No links available");
      }

      console.log(`\nMarket Data:`);
      if (asset.marketData) {
        console.log(
          `Price: $${
            asset.marketData.priceUsd?.toLocaleString() ||
            asset.marketData.price?.toLocaleString() ||
            "N/A"
          }`
        );
        console.log(
          `Market Cap: $${
            asset.marketData.marketcap?.circulatingUsd?.toLocaleString() ||
            asset.marketData.marketCap?.toLocaleString() ||
            "N/A"
          }`
        );
        console.log(
          `24h Volume: $${
            asset.marketData.volume24Hour?.toLocaleString() ||
            asset.marketData.volume24h?.toLocaleString() ||
            "N/A"
          }`
        );
      } else {
        console.log("No market data available");
      }

      console.log(`\nAll-Time High:`);
      if (asset.allTimeHigh) {
        const dateValue =
          asset.allTimeHigh.allTimeHighDate || asset.allTimeHigh.date;
        const athDate = dateValue
          ? new Date(dateValue).toLocaleDateString()
          : "N/A";
        console.log(`Date: ${athDate}`);
        console.log(
          `Price: $${
            asset.allTimeHigh.allTimeHigh?.toLocaleString() ||
            asset.allTimeHigh.price?.toLocaleString() ||
            "N/A"
          }`
        );
        console.log(
          `Down from ATH: ${
            asset.allTimeHigh.percentDownFromAllTimeHigh?.toFixed(2) ||
            asset.allTimeHigh.percentDown?.toFixed(2) ||
            "N/A"
          }%`
        );
      } else {
        console.log("No ATH data available");
      }

      console.log(`\nROI Data:`);
      if (asset.returnOnInvestment) {
        console.log(
          `24h Change: ${
            asset.returnOnInvestment.priceChange24h?.toFixed(2) ||
            asset.returnOnInvestment.last24h?.toFixed(2) ||
            "N/A"
          }%`
        );
        console.log(
          `7d Change: ${
            asset.returnOnInvestment.priceChange7d?.toFixed(2) ||
            asset.returnOnInvestment.last7d?.toFixed(2) ||
            "N/A"
          }%`
        );
        console.log(
          `30d Change: ${
            asset.returnOnInvestment.priceChange30d?.toFixed(2) ||
            asset.returnOnInvestment.last30d?.toFixed(2) ||
            "N/A"
          }%`
        );
        console.log(
          `1y Change: ${
            asset.returnOnInvestment.priceChange1y?.toFixed(2) ||
            asset.returnOnInvestment.last1y?.toFixed(2) ||
            "N/A"
          }%`
        );
      } else {
        console.log("No ROI data available");
      }

      if (response.length > 1) {
        console.log("\n" + "-".repeat(50));
      }
    }

    return response;
  } catch (error) {
    console.error("Error fetching asset details:", error);
    throw error;
  }
}

/**
 * Example 7: Get timeseries catalog for assets
 */
async function getTimeseriesCatalog() {
  try {
    const response = await client.asset.getAssetsTimeseriesCatalog();

    console.log(`Retrieved ${response.datasets.length} timeseries datasets`);

    for (const dataset of response.datasets.slice(0, 3)) {
      console.log(`\nDataset: ${dataset.slug}`);
      console.log(
        `Available granularities: ${dataset.granularities.join(", ")}`
      );
      console.log(
        `Available metrics: ${dataset.metrics
          .slice(0, 3)
          .map((m: any) => m.name)
          .join(", ")}${dataset.metrics.length > 3 ? "..." : ""}`
      );
    }

    return response;
  } catch (error) {
    console.error("Error fetching timeseries catalog:", error);
    throw error;
  }
}

/**
 * Example 8: Get all-time high information for assets
 */
async function getAssetsATHInfo() {
  try {
    const response = await client.asset.getAssetsV2ATH({
      limit: 10,
    });

    console.log(`Retrieved ATH data for ${response.data.length} assets`);

    const t = new Table({
      columns: [
        { name: "Name", alignment: "left" },
        { name: "Symbol", alignment: "left" },
        { name: "ATH Date", alignment: "left" },
        { name: "ATH Price", alignment: "right" },
        { name: "Down From ATH", alignment: "right" },
        { name: "Up To ATH", alignment: "right" },
      ],
    });

    for (const asset of response.data) {
      t.addRow({
        Name: asset.name,
        Symbol: asset.symbol,
        "ATH Date": new Date(asset.all_time_high_date).toLocaleDateString(),
        "ATH Price": `$${asset.all_time_high.toLocaleString()}`,
        "Down From ATH": `${asset.percent_down_from_ath.toFixed(2)}%`,
        "Up To ATH": `${asset.percent_up_to_ath.toFixed(2)}%`,
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error("Error fetching ATH data:", error);
    throw error;
  }
}

/**
 * Example 9: Get ROI information for assets
 */
async function getAssetsROIInfo() {
  try {
    const response = await client.asset.getAssetsV2ROI({
      limit: 10,
    });

    console.log(`Retrieved ROI data for ${response.data.length} assets`);

    const t = new Table({
      columns: [
        { name: "Name", alignment: "left" },
        { name: "Symbol", alignment: "left" },
        { name: "24h Change", alignment: "right" },
        { name: "7d Change", alignment: "right" },
        { name: "30d Change", alignment: "right" },
        { name: "1y Change", alignment: "right" },
      ],
    });

    for (const asset of response.data) {
      t.addRow({
        Name: asset.name,
        Symbol: asset.symbol,
        "24h Change": `${asset.price_change_24h.toFixed(2)}%`,
        "7d Change": `${asset.price_change_7d.toFixed(2)}%`,
        "30d Change": `${asset.price_change_30d.toFixed(2)}%`,
        "1y Change": `${asset.price_change_1y.toFixed(2)}%`,
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error("Error fetching ROI data:", error);
    throw error;
  }
}

/**
 * Example 10: Get timeseries data for a specific asset and dataset
 */
async function getAssetTimeseriesData(
  assetIdentifier: string,
  datasetSlug: string
) {
  try {
    const response = await client.asset.getAssetTimeseries({
      entityIdentifier: assetIdentifier,
      datasetSlug: datasetSlug,
    });

    // Access the points array from the properly typed response
    const points = response.data.points || [];
    const dataLength = points.length;

    console.log(
      `Retrieved ${dataLength} timeseries data points for ${assetIdentifier}`
    );
    console.log(`Dataset: ${datasetSlug}`);

    // Print metadata information
    console.log("\nMetadata:");
    console.log(`Granularity: ${response.metadata.granularity}`);
    console.log(
      `Metrics: ${response.metadata.pointSchemas
        .map((schema: any) => schema.name)
        .join(", ")}`
    );

    // Print a sample of data points
    console.log("\nSample data points:");

    if (points.length > 0) {
      // Display only the first 5 points for brevity
      for (const point of points.slice(0, 5)) {
        console.log(
          `Timestamp: ${new Date(point[0] * 1000).toLocaleDateString()}`
        );
        console.log(`Open: $${point[1].toLocaleString()}`);
        console.log(`High: $${point[2].toLocaleString()}`);
        console.log(`Low: $${point[3].toLocaleString()}`);
        console.log(`Close: $${point[4].toLocaleString()}`);
        console.log(`Volume: $${point[5].toLocaleString()}`);
        console.log("---");
      }
      console.log(`... and ${points.length - 5} more points.`);
    } else {
      console.log("No points available in the response data.");
    }

    return response;
  } catch (error) {
    console.error("Error fetching timeseries data:", error);
    throw error;
  }
}

/**
 * Example 11: Get timeseries data with specific granularity
 */
async function getAssetTimeseriesWithSpecificGranularity(
  assetIdentifier: string,
  datasetSlug: string,
  granularity: string
) {
  try {
    const response = await client.asset.getAssetTimeseriesWithGranularity({
      entityIdentifier: assetIdentifier,
      datasetSlug: datasetSlug,
      granularity: granularity,
    });

    // Access the points array from the properly typed response
    const points = response.data.points || [];
    const dataLength = points.length;

    console.log(
      `Retrieved ${dataLength} timeseries data points for ${assetIdentifier}`
    );
    console.log(`Dataset: ${datasetSlug}, Granularity: ${granularity}`);

    // Print metadata information
    console.log("\nMetadata:");
    console.log(`Granularity: ${response.metadata.granularity}`);
    console.log(
      `Metrics: ${response.metadata.pointSchemas
        .map((schema: any) => schema.name)
        .join(", ")}`
    );

    // Print a sample of data points
    console.log("\nSample data points:");

    if (points.length > 0) {
      // Display only the first 5 points for brevity
      for (const point of points.slice(0, 5)) {
        console.log(
          `Timestamp: ${new Date(point[0] * 1000).toLocaleDateString()}`
        );
        console.log(`Open: $${point[1].toLocaleString()}`);
        console.log(`High: $${point[2].toLocaleString()}`);
        console.log(`Low: $${point[3].toLocaleString()}`);
        console.log(`Close: $${point[4].toLocaleString()}`);
        console.log(`Volume: $${point[5].toLocaleString()}`);
        console.log("---");
      }
      console.log(`... and ${points.length - 5} more points.`);
    } else {
      console.log("No points available in the response data.");
    }

    return response;
  } catch (error) {
    console.error("Error fetching timeseries data with granularity:", error);
    throw error;
  }
}

async function main() {
  // Only run V2 examples to test the new endpoints

  // 5. Get V2 Assets with coverage information
  // await getAssetsV2WithCoverage();

  // 6. Get detailed information for Bitcoin and Ethereum
  await getAssetDetailsBySlug(["bitcoin", "ethereum"]);

  // 7. Get timeseries catalog
  // await getTimeseriesCatalog();

  // 8. Get ATH information for assets
  // await getAssetsATHInfo();

  // 9. Get ROI information for assets
  // await getAssetsROIInfo();

  // 10. Get timeseries data for Bitcoin price
  // Note: This requires enterprise access, uncomment if you have access
  await getAssetTimeseriesData("bitcoin", "price");

  // 11. Get timeseries data with daily granularity
  // Note: This requires enterprise access, uncomment if you have access
  await getAssetTimeseriesWithSpecificGranularity("bitcoin", "price", "1d");
}

main().catch(console.error);
