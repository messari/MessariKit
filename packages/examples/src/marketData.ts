/**
 * Market Data Example
 * 
 * This example demonstrates how to use the MessariKit client to access market data endpoints.
 * It shows how to fetch price data, ROI data, and ATH (All-Time High) data for both individual assets
 * and multiple assets at once.
 */

import { MessariClient } from "@messari-kit/api";
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
    // Use the markets.getAssetPrice method from the client
    const response = await client.markets.getAssetPrice({ assetId });
    
    console.log(`Market data for ${assetId}:`);
    console.log(`Current price (USD): $${response.priceUsd?.toFixed(2)}`);
    console.log(`24h change: ${response.percentChangeUsd24Hours?.toFixed(2)}%`);
    console.log(`24h volume: $${response.volume24Hours?.toFixed(2)}`);
    
    // Access OHLCV data
    if (response.ohlcv24Hours) {
      console.log("\n24h OHLCV data:");
      console.log(`Open: $${response.ohlcv24Hours.open?.toFixed(2)}`);
      console.log(`High: $${response.ohlcv24Hours.high?.toFixed(2)}`);
      console.log(`Low: $${response.ohlcv24Hours.low?.toFixed(2)}`);
      console.log(`Close: $${response.ohlcv24Hours.close?.toFixed(2)}`);
      console.log(`Volume: $${response.ohlcv24Hours.volume?.toFixed(2)}`);
    }
    
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
    // Use the markets.getAssetROI method from the client
    const response = await client.markets.getAssetROI({ assetId });
    
    console.log(`\nROI data for ${response.asset?.name} (${response.asset?.symbol}):`);
    
    if (response.roiData) {
      // Display ROI data for different time periods
      console.log("Performance:");
      console.log(`7 days: ${response.roiData.percentChange1Week?.toFixed(2) || 'N/A'}%`);
      console.log(`30 days: ${response.roiData.percentChange3Months?.toFixed(2) || 'N/A'}%`);
      console.log(`1 year: ${response.roiData.percentChange1Year?.toFixed(2) || 'N/A'}%`);
      console.log("--------------------------------");

      console.log("Performance Relative to $BTC:");
      console.log(`7 days: ${response.roiData.percentChangeBtc1Week?.toFixed(2) || 'N/A'}%`);
      console.log(`30 days: ${response.roiData.percentChangeBtc3Months?.toFixed(2) || 'N/A'}%`);
      console.log(`1 year: ${response.roiData.percentChangeBtc1Year?.toFixed(2) || 'N/A'}%`);
      console.log("--------------------------------");

      console.log("Performance Relative to $ETH:");
      console.log(`7 days: ${response.roiData.percentChangeEth1Week?.toFixed(2) || 'N/A'}%`);
      console.log(`30 days: ${response.roiData.percentChangeEth3Months?.toFixed(2) || 'N/A'}%`);
      console.log(`1 year: ${response.roiData.percentChangeEth1Year?.toFixed(2) || 'N/A'}%`);
      console.log("--------------------------------");
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
    // Use the markets.getAssetATH method from the client
    const response = await client.markets.getAssetATH({ assetId });
    
    console.log(`\nATH data for ${response.asset?.name} (${response.asset?.symbol}):`);
    
    if (response.athData) {
      const athDate = new Date(response.athData.timestamp || "");
      console.log(`All-time high: $${response.athData.price?.toFixed(2)}`);
      console.log(`ATH date: ${athDate.toLocaleDateString()}`);
      console.log(`Current price is down ${response.athData.percentDown?.toFixed(2)}% from ATH`);
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
    // Use the markets.getAllAssetsROI method from the client
    const response = await client.markets.getAllAssetsROI();
    
    console.log("\nROI data for all assets:");
    console.log(`Total assets: ${response.length}`);
    
    // Display the top 5 performers in the last month
    const top5Performers = [...response]
      .sort((a, b) => {
        // Access ROI data properties based on the actual API response structure
        const aChange = a.roiData?.percentChange1Month || 0;
        const bChange = b.roiData?.percentChange1Month || 0;
        return bChange - aChange;
      })
      .slice(0, 5);
    
    console.log("\nTop 5 performers (1month):");
    top5Performers.forEach((asset, index) => {
      console.log(
        `${index + 1}. ${asset.asset?.name} (${asset.asset?.symbol}): ${asset.roiData?.percentChange1Month?.toFixed(2) || 'N/A'}%`
      );
    });
    
    return top5Performers;
  } catch (error) {
    console.error("Error fetching all assets ROI data:", error);
    throw error;
  }
}

/**
 * Main function to run all examples
 */
async function main() {
  try {
    // Example usage with Bitcoin
    const bitcoinId = "1e31218a-e44e-4285-820c-8282ee222035";
    
    // Get market data for Bitcoin
    await getAssetMarketData(bitcoinId);
    
    // Get ROI data for Bitcoin
    await getAssetROIData(bitcoinId);
    
    // Get ATH data for Bitcoin
    await getAssetATHData(bitcoinId);
    
    // Get ROI data for all assets
    await getTop5ROIPerformers();
    
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main().catch(console.error);
