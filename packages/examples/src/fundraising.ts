import { MessariClient } from "@messari-kit/api";
import { printTable } from "console-table-printer";
import type {
  getExchangeRecapParameters,
  getFundingRoundsInvestorsParameters,
  getFundingRoundsParameters,
  getProjectRecapParameters,
  Investors,
} from "@messari-kit/types";
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
  const roundMap: Record<string, { entityName: string, type: string }> = {};
  // Get the latest funding rounds filter by type and announcedAfter date
  try {
    const roundsParams: getFundingRoundsParameters = { page: 1, limit: 10, type: "Seed,Series A", announcedAfter: "2025-01-01T00:00:00Z" };
    const resp = await client.fundraising.getFundingRounds(roundsParams);

    console.log("\n--------------------------------");
    console.log("Funding Rounds");
    console.log("--------------------------------");
    const rounds = resp.data;
    if (rounds.length > 0) {
      for (const round of rounds) {
        if (round.id && round.fundedEntity?.name) {
          roundMap[round.id] = { entityName: round.fundedEntity?.name, type: round.type ?? "" };
        }
      }
      const rows = rounds.map((r) => ({
        "Id": r.id,
        "Date": r.announcementDate,
        "Entity": r.fundedEntity?.name,
        "Type": r.type,
        "Amount Raised": r.amountRaisedUSD,
      }));
      printTable(rows);
    }
  } catch (error) {
    console.error("Error calling getProjectRecap:", error);
  }

  // Get the funding round investors
  try {
    const investorsParams: getFundingRoundsInvestorsParameters = { page: 1, limit: 10, type: "Seed,Series A", announcedAfter: "2025-01-01T00:00:00Z" };
    const resp = await client.fundraising.getFundingRoundsInvestors(investorsParams);

    console.log("\n--------------------------------");
    console.log("Funding Round - Investors");
    console.log("--------------------------------");

    const rounds = resp.data;
    if (rounds.length > 0) {
      for (const round of rounds) {
        const roundName = roundMap[round.fundingRoundId ?? ""];
        if (!roundName) {
          continue;
        }

        console.log("Round Id:", round.fundingRoundId);
        console.log(roundName.entityName, "-", roundName.type);
        if (round.organizations) {
          const rows = round.organizations.map((o) => ({
            "Id": o.id,
            "Name": o.name,
            "Location": o.location,
          }));
          printTable(rows);
        }
      }
    }
  }
  catch (error) {
    console.error("Error calling getProjectRecap:", error);
  }
}


main().catch(console.error);
