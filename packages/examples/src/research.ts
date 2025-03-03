import { MessariClient, LogLevel } from "@messari-kit/api";
import type { Author, Tag } from "@messari-kit/types";
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

const newReportTable = () => {
  const t = new Table({
    columns: [
      { name: "Title", alignment: "left", maxLen: 50 },
      { name: "Published", alignment: "left" },
      { name: "Reading Time", alignment: "right" },
      { name: "Authors", alignment: "left", maxLen: 30 },
      { name: "Assets", alignment: "left", maxLen: 30 },
      { name: "Tags", alignment: "left", maxLen: 30 },
      // { name: "ID", alignment: "left" },
    ],
  });
  return t;
};

const parseTags = (tags: Tag[]) => tags?.map((tag) => tag.name).join(", ") || "N/A";

/**
 * Example 1: Get research reports with contentType filter
 */
async function getReportsBasic() {
  try {
    const response = await client.research.getResearchReports({
      contentType: "report",
      limit: 5,
    });

    console.log(`Retrieved ${response.length} research reports. Latest reports:`);
    const t = newReportTable();
    for (const report of response) {
      t.addRow({
        "Title": report.title,
        "Published": new Date(report.publishDate).toLocaleDateString(),
        "Reading Time": `${report.readingTimeInMinutes.toFixed(2)} min`,
        "Authors": report.authors.map((author: Author) => author.name).join(", "),
        "Assets": report.assetIds?.length ? `${report.assetIds.length} assets` : "N/A",
        "Tags": parseTags(report.tags),
        // "ID": report.id,
      });
    }
    t.printTable();

    // Save the first report ID for use in the next example
    return response[0]?.id;
  } catch (error) {
    console.error("Error fetching research reports:", error);
    throw error;
  }
}

/**
 * Example 2: Get research reports with assetId filter
 */
async function getReportsByAsset(assetId: string) {
  try {
    const response = await client.research.getResearchReports({
      contentType: "markdown",
      assetId: assetId,
      limit: 5,
    });

    console.log(`Retrieved ${response.length} research reports for asset ID: ${assetId}`);
    const t = newReportTable();
    for (const report of response) {
      t.addRow({
        "Title": report.title,
        "Published": new Date(report.publishDate).toLocaleDateString(),
        "Reading Time": `${report.readingTimeInMinutes.toFixed(2)} min`,
        "Authors": report.authors.map((author: Author) => author.name).join(", "),
        "Assets": report.assetIds?.length ? `${report.assetIds.length} assets` : "N/A",
        "Tags": parseTags(report.tags),
        // "ID": report.id,
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error(`Error fetching reports for asset ${assetId}:`, error);
    throw error;
  }
}

/**
 * Example 3: Get research reports with tag filter
 */
async function getReportsByTag(tag: string) {
  try {
    const response = await client.research.getResearchReports({
      contentType: "markdown",
      tags: tag,
      limit: 5,
    });

    console.log(`Retrieved ${response.length} research reports with tag: ${tag}`);
    const t = newReportTable();
    for (const report of response) {
      t.addRow({
        "Title": report.title,
        "Published": new Date(report.publishDate).toLocaleDateString(),
        "Reading Time": `${report.readingTimeInMinutes.toFixed(2)} min`,
        "Authors": report.authors.map((author: Author) => author.name).join(", "),
        "Assets": report.assetIds?.length ? `${report.assetIds.length} assets` : "N/A",
        "Tags": parseTags(report.tags),
        // "ID": report.id,
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error(`Error fetching reports with tag ${tag}:`, error);
    throw error;
  }
}

/**
 * Example 4: Get a specific research report by ID
 */
async function getReportById(reportId: string) {
  try {
    const report = await client.research.getResearchReportById({
      id: reportId,
    });

    console.log(`Retrieved research report: ${report.title}`);
    console.log(`${"=".repeat(80)}`);
    console.log(`Title: ${report.title}`);
    console.log(`Published: ${new Date(report.publishDate).toLocaleString()}`);
    console.log(`Authors: ${report.authors.map((author: Author) => author.name).join(", ")}`);
    console.log(`Reading Time: ${report.readingTimeInMinutes.toFixed(2)} minutes`);
    console.log(`Tags: ${parseTags(report.tags)}`);
    console.log(`${"=".repeat(80)}`);
    console.log("HOOK:");
    console.log(report.hook);
    console.log(`${"=".repeat(80)}`);
    // Only display first 200 characters of content to keep the output manageable
    console.log("CONTENT PREVIEW:");
    console.log(`${report.content.substring(0, 200)}...`);
    console.log(`${"=".repeat(80)}`);

    return report;
  } catch (error) {
    console.error(`Error fetching report with ID ${reportId}:`, error);
    throw error;
  }
}

/**
 * Example 5: Get all available research report tags
 */
// async function getResearchTags() {
//   try {
//     const tags = await client.research.getResearchReportTags();

//     console.log(`Retrieved ${tags.length} research report tags:`);
//     // Display tags in columns
//     const tagsPerRow = 3;
//     for (let i = 0; i < tags.length; i += tagsPerRow) {
//       const row = tags.slice(i, i + tagsPerRow).map((tag: string) => tag.padEnd(25));
//       console.log(row.join(" | "));
//     }

//     return tags;
//   } catch (error) {
//     console.error("Error fetching research tags:", error);
//     throw error;
//   }
// }

async function main() {
  try {
    // 1. Get basic research reports
    const firstReportId = await getReportsBasic();
    console.log("\n");

    // 2. Get reports by asset (using Bitcoin's ID)
    await getReportsByAsset("1e31218a-e44e-4285-820c-8282ee222035"); // Bitcoin ID
    console.log("\n");

    // 3. Get reports by tag
    await getReportsByTag("DePIN");
    console.log("\n");

    // 4. Get a specific report by ID
    if (firstReportId) {
      await getReportById(firstReportId);
      console.log("\n");
    }

    // 5. Get all research tags
    // await getResearchTags();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main().catch(console.error);
