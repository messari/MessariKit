import { MessariClient } from "@messari/sdk";
import { printTable } from "console-table-printer";
import type {
  getAcquisitionDealsParameters,
  getFundingRoundsInvestorsParameters,
  getFundingRoundsParameters,
  getOrganizationsParameters,
  getProjectsParameters,
} from "@messari/sdk";
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
  const roundMap: Record<string, { entityName: string; type: string }> = {};
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
  } catch (error) {
    console.error("Error calling getProjectRecap:", error);
  }

  // Get the acquisition deals
  try {
    const dealsParams: getAcquisitionDealsParameters = { page: 1, limit: 10 };
    const resp = await client.fundraising.getAcquisitionDeals(dealsParams);

    console.log("\n--------------------------------");
    console.log("M&A Deals");
    console.log("--------------------------------");

    const deals = resp.data;
    if (deals.length > 0) {
      const rows = deals.map((d) => ({
        "Date": d.announcementDate,
        "Entity": d.acquiredEntity?.name,
        "Acquirer": d.acquiringEntity?.name,
        "Type": d.status,
        "Amount Raised": d.transactionAmountUSD,
      }));
      printTable(rows);
    }
  } catch (error) {
    console.error("Error calling getAcquisitionDeals:", error);
  }

  // Get the organizations
  try {
    const orgsParams: getOrganizationsParameters = { page: 1, limit: 10 };
    const resp = await client.fundraising.getOrganizations(orgsParams);
    console.log("\n--------------------------------");
    console.log("Organizations");
    console.log("--------------------------------");
    const orgs = resp.data;
    if (orgs.length > 0) {
      const rows = orgs.map((o) => ({
        "Id": o.id,
        "Name": o.name,
        "Location": o.location,
      }));
      printTable(rows);
    }
  } catch (error) {
    console.error("Error calling getOrganizations:", error);
  }

  // Get the projects
  try {
    const projectsParams: getProjectsParameters = { page: 1, limit: 10 };
    const resp = await client.fundraising.getProjects(projectsParams);
    console.log("\n--------------------------------");
    console.log("Projects");
    console.log("--------------------------------");
    const projects = resp.data;
    if (projects.length > 0) {
      const rows = projects.map((p) => ({
        "Id": p.id,
        "Name": p.name,
        "Tags": p.tags?.join(", "),
      }));
      printTable(rows);
    }
  } catch (error) {
    console.error("Error calling getProjects:", error);
  }
}

main().catch(console.error);
