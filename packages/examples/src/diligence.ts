import { MessariClient } from "../../api/dist";
import { printTable } from "console-table-printer";
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

// Initialize the Messari client
const client = new MessariClient({
  apiKey: API_KEY,
  // Optional: Override the base URL if needed
  // baseUrl: "https://api.messari.io",
});

async function main() {
  // Get preview of available reports
  try {
    const previews = await client.diligence.getDiligencePreview();
    console.log("\n--------------------------------");
    console.log("Diligence Previews");
    console.log("--------------------------------");
    const rows = [];
    for (const preview of previews) {
      if (rows.length > 5) break;
      rows.push({
        "AssetId": preview.assetId,
        "LastUpdated": preview.lastRevisedAt,
        "Project": preview.projectName,
        "Sector": preview.sector,
      });
    }
    printTable(rows);
  } catch (error) {
    console.error("Error calling getDiligencePreview:", error);
  }

  // Get a report by asset ID
  try {
    const virtualsAssetId = "4eb07099-9d91-4318-a63f-6672e191ef43";
    const report = await client.diligence.getDiligenceReport({ assetId: virtualsAssetId });
    console.log("\n--------------------------------");
    console.log("Diligence Report");
    console.log("--------------------------------");

    let excerpt = report.sections?.general_information?.markdown ?? "";
    excerpt = excerpt.length > 100 ? `${excerpt.substring(0, 100)}...` : excerpt;
    printTable([
      {
        "AssetId": report.assetId,
        "Project": report.projectName,
        "LastUpdated": report.lastRevisedAt,
      },
    ]);
    console.log(excerpt);
  } catch (error) {
    console.error("Error calling getDiligenceReport:", error);
  }
}

main().catch(console.error);
