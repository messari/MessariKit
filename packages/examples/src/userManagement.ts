import { MessariClient } from "@messari/sdk";
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
    // Example 1: Get Team's Credit Allowance
    console.log("\n--------------------------------");
    console.log("Get Team's Credit Allowance");
    console.log("--------------------------------");

    const allowance = await client.userManagement.getTeamAllowance();

    console.log("Team Allowance Information:");
    console.log(JSON.stringify(allowance, null, 2));
  } catch (error) {
    console.error("Error fetching team allowance:", error);
  }

  try {
    // Example 2: Get User Permissions
    console.log("\n--------------------------------");
    console.log("Get User Permissions");
    console.log("--------------------------------");

    const permissions = await client.userManagement.getPermissions();

    console.log("User Permissions:");
    console.log(JSON.stringify(permissions, null, 2));
  } catch (error) {
    console.error("Error fetching user permissions:", error);
  }

  try {
    // Example 3: List User's Watchlists
    console.log("\n--------------------------------");
    console.log("List User's Watchlists");
    console.log("--------------------------------");

    const watchlists = await client.userManagement.listWatchlists();

    console.log("User Watchlists:");
    console.log(JSON.stringify(watchlists, null, 2));

    // Create a new watchlist
    console.log("\n--------------------------------");
    console.log("Create a New Watchlist");
    console.log("--------------------------------");

    const newWatchlistTitle = `Test Watchlist - ${new Date().toISOString()}`;

    // Include Bitcoin and Ethereum by default
    const newWatchlist = await client.userManagement.createWatchlist({
      title: newWatchlistTitle,
      assetIds: [
        "1e31218a-e44e-4285-820c-8282ee222035", // Bitcoin
        "21c795f5-1bfd-40c3-858e-e9d7e820c6d0", // Ethereum
      ],
    });

    const watchlistId = newWatchlist.id;
    console.log(`Created new watchlist: "${newWatchlistTitle}"`);
    console.log("Watchlist Details:");
    console.log(JSON.stringify(newWatchlist, null, 2));

    // Example 4: Update a Watchlist
    console.log("\n--------------------------------");
    console.log(`Update Watchlist (ID: ${watchlistId})`);
    console.log("--------------------------------");

    const updatedTitle = `Updated Watchlist - ${new Date().toISOString()}`;
    const updatedWatchlist = await client.userManagement.updateWatchlist({
      id: watchlistId,
      watchlistID: watchlistId,
      title: updatedTitle,
    });

    console.log("Updated Watchlist:");
    console.log(JSON.stringify(updatedWatchlist, null, 2));

    // Example 6: Modify Watchlist Assets (Add)
    console.log("\n--------------------------------");
    console.log(`Add Assets to Watchlist (ID: ${watchlistId})`);
    console.log("--------------------------------");

    // Add Solana to the watchlist
    const modifiedWatchlist = await client.userManagement.modifyWatchlistAssets({
      id: watchlistId,
      watchlistID: watchlistId,
      action: "add",
      assetIds: ["c16f5137-def3-4c5c-b3e8-7921f9c8f0d2"], // Solana
    });

    console.log("Watchlist after adding assets:");
    console.log(JSON.stringify(modifiedWatchlist, null, 2));

    // Example 7: Modify Watchlist Assets (Remove)
    console.log("\n--------------------------------");
    console.log(`Remove Assets from Watchlist (ID: ${watchlistId})`);
    console.log("--------------------------------");

    // Remove Ethereum from the watchlist
    const modifiedWatchlist2 = await client.userManagement.modifyWatchlistAssets({
      id: watchlistId,
      watchlistID: watchlistId,
      action: "remove",
      assetIds: ["21c795f5-1bfd-40c3-858e-e9d7e820c6d0"], // Ethereum
    });

    console.log("Watchlist after removing assets:");
    console.log(JSON.stringify(modifiedWatchlist2, null, 2));

    // Example 8: Delete a Watchlist
    console.log("\n--------------------------------");
    console.log(`Delete Watchlist (ID: ${watchlistId})`);
    console.log("--------------------------------");

    const deleteResult = await client.userManagement.deleteWatchlist({
      id: watchlistId,
    });

    console.log("Delete Result:");
    console.log(JSON.stringify(deleteResult, null, 2));

    // Verify the watchlist is deleted
    const finalWatchlists = await client.userManagement.listWatchlists();
    const deletedWatchlist = finalWatchlists.find((w) => w.id === watchlistId);

    if (!deletedWatchlist) {
      console.log("Watchlist successfully deleted.");
    } else {
      console.log("Watchlist still exists after deletion attempt.");
    }
  } catch (error) {
    console.error("Error in watchlist operations:", error);
  }
}

main().catch(console.error);
