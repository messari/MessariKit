import { MessariClient, LogLevel } from "@messari/sdk";
import dotenv from "dotenv";
import { Table } from "console-table-printer";

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
  //   logLevel: LogLevel.DEBUG,
});

const newAssetTable = () => {
  const t = new Table({
    columns: [
      { name: "Name", alignment: "left", maxLen: 30 },
      { name: "Symbol", alignment: "left" },
      { name: "Category", alignment: "left", maxLen: 20 },
      { name: "Sector", alignment: "left", maxLen: 20 },
      { name: "Genesis Date", alignment: "left" },
      { name: "Projected End", alignment: "left" },
      { name: "Tags", alignment: "left", maxLen: 30 },
    ],
  });
  return t;
};

const newAllocationTable = () => {
  const t = new Table({
    columns: [
      { name: "Asset", alignment: "left", maxLen: 20 },
      { name: "Recipient", alignment: "left", maxLen: 30 },
      { name: "Total Allocation", alignment: "right" },
      { name: "Unlocked", alignment: "right" },
      { name: "Remaining", alignment: "right" },
      { name: "Progress", alignment: "right" },
    ],
  });
  return t;
};

const formatNumber = (num?: number) => {
  if (num === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 5,
    minimumFractionDigits: 2,
  }).format(num * 100); // TODO: Is this correct?
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

/**
 * Example 1: Get all supported token unlock assets
 */
async function getSupportedAssets() {
  try {
    const response = await client.tokenUnlocks.getSupportedAssets();

    console.log(`Retrieved ${response.length} supported token unlock assets:`);
    const t = newAssetTable();
    for (const asset of response) {
      t.addRow({
        "Name": asset.name || "N/A",
        "Symbol": asset.symbol || "N/A",
        "Category": asset.category || "N/A",
        "Sector": asset.sector || "N/A",
        "Genesis Date": formatDate(asset.genesisDate),
        "Projected End": formatDate(asset.projectedEndDate),
        "Tags": asset.tags?.join(", ") || "N/A",
      });
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error("Error fetching supported assets:", error);
    throw error;
  }
}

/**
 * Example 2: Get token unlock allocations for specific assets
 */
async function getAssetAllocations(assetIDs: string) {
  try {
    const response = await client.tokenUnlocks.getAllocations({
      assetIDs,
    });

    console.log(`Retrieved allocations for assets: ${assetIDs}`);
    const t = newAllocationTable();
    for (const allocation of response) {
      const assetName = allocation.asset?.name || "Unknown Asset";
      for (const alloc of allocation.allocations || []) {
        t.addRow({
          "Asset": assetName,
          "Recipient": alloc.allocationRecipient || "N/A",
          "Total Allocation": formatNumber(alloc.totalAllocationUSD),
          "Unlocked": formatNumber(alloc.cumulativeUnlockedUSD),
          "Remaining": formatNumber(alloc.unlocksRemainingUSD),
          "Progress": `${formatNumber(alloc.percentOfUnlocksCompleted)}%`,
        });
      }
    }
    t.printTable();

    return response;
  } catch (error) {
    console.error(`Error fetching allocations for assets ${assetIDs}:`, error);
    throw error;
  }
}

/**
 * Example 3: Get vesting schedule for a specific asset
 */
async function getVestingSchedule(assetId: string) {
  try {
    const startTime = new Date();
    startTime.setMonth(startTime.getMonth()); // Now
    const endTime = new Date();
    endTime.setMonth(endTime.getMonth() + 10); // Next 10 months (Note: 12 months breaks API functionality.... 400 error smh)

    const response = await client.tokenUnlocks.getVestingSchedule({
      assetId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    console.log(`Retrieved vesting schedule for asset ID: ${assetId}`);
    console.log("Vesting Schedule Summary:");
    const assetName = response.asset?.name || "Unknown Asset";
    console.log(`\nAsset: ${assetName}`);
    console.log(`Genesis Date: ${formatDate(response.genesisDate)}`);
    console.log(`Projected End: ${formatDate(response.projectedEndDate)}`);

    if (response.totalDailySnapshots?.length) {
      const latest = response.totalDailySnapshots[response.totalDailySnapshots.length - 1];
      console.log("\nLatest Snapshot:");
      console.log(`- Cumulative Unlocked: ${formatNumber(latest.cumulativeUnlockedUSD)} USD`);
      console.log(`- Remaining: ${formatNumber(latest.unlocksRemainingUSD)} USD`);
      console.log(`- Progress: ${formatNumber(latest.percentOfUnlocksCompleted)}%`);
    }

    return response;
  } catch (error) {
    console.error(`Error fetching vesting schedule for asset ${assetId}:`, error);
    throw error;
  }
}

/**
 * Example 4: Get token unlocks with different intervals
 */
async function getTokenUnlocks(assetId: string) {
  try {
    const startTime = new Date();
    startTime.setMonth(startTime.getMonth()); // Now
    const endTime = new Date();
    endTime.setMonth(endTime.getMonth() + 10); // Next 10 months

    // Get monthly unlocks
    const response = await client.tokenUnlocks.getUnlocks({
      assetId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      interval: "MONTHLY",
    });

    console.log(`Retrieved monthly unlocks for asset ID: ${assetId}`);
    console.log("Monthly Unlocks Summary:");
    const assetName = response.asset?.name || "Unknown Asset";
    console.log(`\nAsset: ${assetName}`);
    console.log(`Period: ${formatDate(response.startDate)} to ${formatDate(response.endDate)}`);

    if (response.totalSnapshots?.length) {
      const latest = response.totalSnapshots[response.totalSnapshots.length - 1];
      console.log("Latest Monthly Unlock:");
      console.log(`- Amount: ${formatNumber(latest.unlockedInPeriodUSD)} USD`);
      console.log(`- Date: ${formatDate(latest.timestamp)}`);
    }

    return response; // Return the data for further processing if needed
  } catch (error) {
    console.error(`Error fetching token unlocks for asset ${assetId}:`, error);
    throw error;
  }
}

/**
 * Example 5: Get unlock events for a specific asset
 */
async function getUnlockEvents(assetId: string) {
  try {
    const startTime = new Date();
    startTime.setMonth(startTime.getMonth() - 1); // Last month
    const endTime = new Date();
    endTime.setMonth(endTime.getMonth() + 12); // Next year

    const response = await client.tokenUnlocks.getEvents({
      assetId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    console.log(`Retrieved unlock events for asset ID: ${assetId}`);
    const assetName = response.asset?.name || "Unknown Asset";
    console.log(`\nAsset: ${assetName}`);

    for (const unlockEvent of response.unlockEvents || []) {
      console.log(`\nEvent Date: ${formatDate(unlockEvent.timestamp)}`);

      if (unlockEvent.cliff) {
        console.log("Cliff Event:");
        console.log(`- Amount: ${formatNumber(unlockEvent.cliff.amountUSD)} USD`);
        console.log(`- % of Total: ${formatNumber(unlockEvent.cliff.percentOfTotalAllocation)}%`);
      }

      if (unlockEvent.dailyLinearRateChange) {
        const rateChange = unlockEvent.dailyLinearRateChange;
        console.log("Daily Rate Change:");
        console.log(`- Daily Amount: ${formatNumber(rateChange.dailyAmountUSD)} USD`);
        console.log(`- Next Daily Amount: ${formatNumber(rateChange.nextDailyAmountUSD)} USD`);
        console.log(`- Rate Change: ${formatNumber(rateChange.percentChangeOfRate)}%`);
      }
    }

    return response;
  } catch (error) {
    console.error(`Error fetching unlock events for asset ${assetId}:`, error);
    throw error;
  }
}

async function main() {
  try {
    // 1. Get all supported token unlock assets
    const supportedAssets = await getSupportedAssets();
    console.log("\n");

    // 2. Get allocations for first two supported assets
    if (supportedAssets.length >= 2) {
      const assetIDs = `${supportedAssets[0].id},${supportedAssets[1].id}`;
      await getAssetAllocations(assetIDs);
      console.log("\n");
    }

    // 3. Get vesting schedule for the first supported asset
    if (supportedAssets.length > 0 && supportedAssets[0].id) {
      await getVestingSchedule(supportedAssets[0].id);
      console.log("\n");
    }

    // 4. Get token unlocks for the first supported asset
    if (supportedAssets.length > 0 && supportedAssets[0].id) {
      await getTokenUnlocks(supportedAssets[0].id);
      console.log("\n");
    }

    // 5. Get unlock events for the first supported asset
    if (supportedAssets.length > 0 && supportedAssets[0].id) {
      await getUnlockEvents(supportedAssets[0].id);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main().catch(console.error);
