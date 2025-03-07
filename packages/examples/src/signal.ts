import { MessariClient } from "@messari/sdk";
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
});

async function main() {
  try {
    console.log("\n--------------------------------");
    console.log("Twitter Influencer Mindshare");
    console.log("--------------------------------");
    const influencersResponse = await client.signal.getInfluencers();
    const rows = [];

    for (const influencer of influencersResponse) {
      if (rows.length > 5) break;
      if (!influencer.socialMetrics || !influencer.mindshare) continue;
      rows.push({
        "Id": influencer.id,
        "Username": influencer.username,
        "Followers": influencer.socialMetrics.followersCount,
        "Mindshare": formatScore(influencer.mindshare.latestScore),
        "7DChange": formatScore(influencer.mindshare.scoreChange7d),
        "30DChange": formatScore(influencer.mindshare.scoreChange30d),
      });
    }
    printTable(rows);
  } catch (error) {
    console.error("Error calling getInfluencers:", error);
  }
  try {
    console.log("\n--------------------------------");
    console.log("Twitter Asset Mindshare");
    console.log("--------------------------------");
    const assetsResponse = await client.signal.getAssets();
    const rows = [];

    for (const asset of assetsResponse) {
      if (rows.length > 5) break;
      if (!asset.mindshare) continue;
      rows.push({
        "Id": asset.id,
        "Name": asset.name,
        "Symbol": asset.symbol,
        "Mindshare": formatScore(asset.mindshare.latestScore),
        "7DChange": formatScore(asset.mindshare.scoreChange7d),
        "30DChange": formatScore(asset.mindshare.scoreChange30d),
      });
    }
    printTable(rows);
  } catch (error) {
    console.error("Error calling getAssets:", error);
  }
}

function formatScore(score: number | undefined) {
  if (!score) return "-";
  return score.toFixed(2);
}

main().catch(console.error);
