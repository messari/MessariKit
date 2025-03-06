/**
 * Market Data Example
 *
 * This example demonstrates how to use the MessariKit client to access market data endpoints.
 * It shows how to fetch price data, ROI data, and ATH (All-Time High) data for both individual assets
 * and multiple assets at once.
 */

import { MessariClient } from "../../api/dist";
import { printTable } from "console-table-printer";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize the client with your API key from environment variables
const client = new MessariClient({
  apiKey: process.env.MESSARI_API_KEY || "YOUR_API_KEY_HERE",
});

/**
 * Example 1: Get market data for a specific asset
 *
 * This function fetches the current price and market data for a specific asset
 * identified by its ID (e.g., "bitcoin", "ethereum").
 */
async function getAssetMarketData(assetId: string) {
  try {
    const response = await client.markets.getAssetPrice({ assetId });

    console.log("Basic Market Data");
    printTable([
      {
        "Price (USD)": `$${response.priceUsd?.toFixed(2)}`,
        "24h Change": `${response.percentChangeUsd24Hours?.toFixed(2)}%`,
        "24h Volume": `$${response.volume24Hours?.toFixed(2)}`,
        "Market Cap": `$${response.marketcap?.circulatingUsd?.toFixed(2)}`,
        "Market Cap (FDV)": `$${response.marketcap?.fullyDilutedUsd?.toFixed(2)}`,
      },
    ]);
    console.log("OHLCV Data");
    printTable([
      {
        "Time Period": "1h",
        "Open": `$${response.ohlcv1Hour?.open?.toFixed(2)}`,
        "High": `$${response.ohlcv1Hour?.high?.toFixed(2)}`,
        "Low": `$${response.ohlcv1Hour?.low?.toFixed(2)}`,
        "Close": `$${response.ohlcv1Hour?.close?.toFixed(2)}`,
        "Volume": `$${response.ohlcv1Hour?.volume?.toFixed(2)}`,
      },
      {
        "Time Period": "24h",
        "Open": `$${response.ohlcv24Hours?.open?.toFixed(2)}`,
        "High": `$${response.ohlcv24Hours?.high?.toFixed(2)}`,
        "Low": `$${response.ohlcv24Hours?.low?.toFixed(2)}`,
        "Close": `$${response.ohlcv24Hours?.close?.toFixed(2)}`,
        "Volume": `$${response.ohlcv24Hours?.volume?.toFixed(2)}`,
      },
    ]);

    return response;
  } catch (error) {
    console.error("Error fetching asset market data:", error);
    throw error;
  }
}

/**
 * Example 2: Get ROI (Return on Investment) data for a specific asset
 *
 * This function fetches ROI data for a specific asset, showing performance
 * over different time periods.
 */
async function getAssetROIData(assetId: string) {
  try {
    const response = await client.markets.getAssetROI({ assetId });

    if (response.roiData) {
      console.log(`${response.name} (${response.symbol}) ROI Data`);
      printTable([
        {
          "Time Period": "7d",
          "USD": `${response.roiData.percentChange1Week?.toFixed(2)}`,
          "vs Bitcoin": `${response.roiData.percentChangeBtc1Week?.toFixed(2)}`,
          "vs Ether": `${response.roiData.percentChangeEth1Week?.toFixed(2)}`,
        },
        {
          "Time Period": "30d",
          "USD": `${response.roiData.percentChange1Month?.toFixed(2)}`,
          "vs Bitcoin": `${response.roiData.percentChangeBtc1Month?.toFixed(2)}`,
          "vs Ether": `${response.roiData.percentChangeEth1Month?.toFixed(2)}`,
        },
        {
          "Time Period": "3m",
          "USD": `${response.roiData.percentChange3Months?.toFixed(2)}`,
          "vs Bitcoin": `${response.roiData.percentChangeBtc3Months?.toFixed(2)}`,
          "vs Ether": `${response.roiData.percentChangeEth3Months?.toFixed(2)}`,
        },
        {
          "Time Period": "1y",
          "USD": `${response.roiData.percentChange1Year?.toFixed(2)}`,
          "vs Bitcoin": `${response.roiData.percentChangeBtc1Year?.toFixed(2)}`,
          "vs Ether": `${response.roiData.percentChangeEth1Year?.toFixed(2)}`,
        },
      ]);
    }

    return response;
  } catch (error) {
    console.error("Error fetching asset ROI data:", error);
    throw error;
  }
}

/**
 * Example 3: Get All-Time High (ATH) data for a specific asset
 *
 * This function fetches ATH data for a specific asset, showing its highest price
 * and how far it is from that peak.
 */
async function getAssetATHData(assetId: string) {
  try {
    const response = await client.markets.getAssetATH({ assetId });

    if (response.allTimeHighData) {
      console.log(`${response.name} (${response.symbol}) ATH Data`);
      const athDate = new Date(response.allTimeHighData.at || "");
      printTable([
        {
          "All-time High": `$${response.allTimeHighData.price?.toFixed(2)}`,
          "ATH Date": athDate.toLocaleDateString(),
          "Days Since": `${response.allTimeHighData.daysSince} days`,
          "Percent Down": `${response.allTimeHighData.percentDown?.toFixed(2)}% from ATH`,
          "Breakeven Multiple": `${response.allTimeHighData.breakevenMultiple?.toFixed(2)}x`,
        },
      ]);
    }
    if (response.cycleLowData) {
      console.log(`${response.name} (${response.symbol}) Cycle Low Data`);
      const cycleLowDate = new Date(response.cycleLowData.at || "");
      printTable([
        {
          "Cycle Low": `$${response.cycleLowData.price?.toFixed(2)}`,
          "Cycle Low Date": cycleLowDate.toLocaleDateString(),
          "Percent Up": `${response.cycleLowData.percentUp?.toFixed(2)}% from cycle low`,
          "Days Since": `${response.cycleLowData.daysSince} days`,
        },
      ]);
    }

    return response;
  } catch (error) {
    console.error("Error fetching asset ATH data:", error);
    throw error;
  }
}

/**
 * Example 4: Get top 5 ROI performers in the last month
 *
 * This function fetches ROI data for all available assets and displays the top 5 performers in the last month.
 */
async function getTop5ROIPerformers() {
  try {
    const response = await client.markets.getAllAssetsROI();

    // Display the top 5 performers in the last month
    const top5Performers = [...response]
      .sort((a, b) => {
        // Access ROI data properties based on the actual API response structure
        const aChange = a.roiData?.percentChange1Month || 0;
        const bChange = b.roiData?.percentChange1Month || 0;
        return bChange - aChange;
      })
      .slice(0, 5);

    console.log(`Top 5 performers (1month) out of ${response.length} assets:`);
    printTable(
      top5Performers.map((asset, index) => ({
        "Rank": `${index + 1}`,
        "Asset": `${asset?.name} (${asset?.symbol})`,
        "1 Month ROI": `${asset.roiData?.percentChange1Month?.toFixed(2) || "N/A"}%`,
      })),
    );

    return response;
  } catch (error) {
    console.error("Error fetching all assets ROI data:", error);
    throw error;
  }
}

async function main() {
  try {
    // Example usage with Hyperliquid
    const hyperliquidId = "b3d5d66c-26a2-404c-9325-91dc714a722b";

    // 1. Get market data for Hyperliquid
    await getAssetMarketData(hyperliquidId);

    // 2. Get ROI data for Hyperliquid
    await getAssetROIData(hyperliquidId);

    // 3. Get ATH data for Hyperliquid
    await getAssetATHData(hyperliquidId);

    // 4. Get ROI data for all assets
    await getTop5ROIPerformers();
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main().catch(console.error);
