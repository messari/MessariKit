import { MessariClient } from "@messari-kit/api";
import {
  getNewsFeedParameters,
  getNewsFeedAssetsParameters,
  getNewsSourcesParameters,
  newsAsset,
  newsSource,
  newsDocument,
} from "@messari-kit/types";
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

// Initialize the Messari client
const client = new MessariClient({
  apiKey: API_KEY,
});

async function runNewsFeedExample() {
  try {
    console.log("1. Fetching news feed with pagination...");

    // Define the news feed parameters with a limit of 10
    const newsFeedParams: getNewsFeedParameters = {
      // Get articles published in the last 7 days
      publishedAfter: (Date.now() - 7 * 24 * 60 * 60 * 1000).toString(),
      // Filter by source type
      sourceTypes: "News",
      // Sort by publish time in descending order (most recent first)
      sort: "2",
      // Limit to 10 articles per page
      limit: "10",
      // First page
      page: "1",
    };

    // Call the getNewsFeedPaginated endpoint
    const paginatedArticles = await client.news.getNewsFeedPaginated(
      newsFeedParams
    );

    // Display pagination metadata
    console.log("Pagination metadata:", paginatedArticles.metadata);
    console.log(
      `Page ${paginatedArticles.metadata?.page} of ${paginatedArticles.metadata?.totalPages}`
    );
    console.log(`Total items: ${paginatedArticles.metadata?.totalRows}`);
    console.log(`Items per page: ${paginatedArticles.metadata?.limit}`);

    // Display the first page of articles
    console.log("\nPage 1 articles:");
    displayArticles(paginatedArticles.data);

    // Get the second page
    if (paginatedArticles.hasNextPage) {
      console.log("\nFetching page 2...");
      const page2 = await paginatedArticles.nextPage();
      console.log(
        `Page ${page2.metadata?.page} of ${page2.metadata?.totalPages}`
      );
      displayArticles(page2.data);

      // Get the third page
      if (page2.hasNextPage) {
        console.log("\nFetching page 3...");
        const page3 = await page2.nextPage();
        console.log(
          `Page ${page3.metadata?.page} of ${page3.metadata?.totalPages}`
        );
        displayArticles(page3.data);
      }
    }

    // Now fetch assets mentioned in news with pagination
    console.log("\n2. Fetching assets mentioned in news with pagination...");

    const assetsParams: getNewsFeedAssetsParameters = {
      limit: "10",
      page: "1",
    };

    // Call the getNewsFeedAssetsPaginated endpoint
    const paginatedAssets = await client.news.getNewsFeedAssetsPaginated(
      assetsParams
    );

    // Display pagination metadata
    console.log("Pagination metadata:", paginatedAssets.metadata);
    console.log(
      `Page ${paginatedAssets.metadata?.page} of ${paginatedAssets.metadata?.totalPages}`
    );

    // Display the first page of assets
    console.log("\nPage 1 assets:");
    displayAssets(paginatedAssets.data);

    // Get the second page
    if (paginatedAssets.hasNextPage) {
      console.log("\nFetching page 2...");
      const page2 = await paginatedAssets.nextPage();
      console.log(
        `Page ${page2.metadata?.page} of ${page2.metadata?.totalPages}`
      );
      displayAssets(page2.data);
    }

    // Finally, fetch news sources with pagination
    console.log("\n3. Fetching news sources with pagination...");

    const sourcesParams: getNewsSourcesParameters = {
      limit: "10",
      page: "1",
    };

    // Call the getNewsSourcesPaginated endpoint
    const paginatedSources = await client.news.getNewsSourcesPaginated(
      sourcesParams
    );

    // Display pagination metadata
    console.log("Pagination metadata:", paginatedSources.metadata);
    console.log(
      `Page ${paginatedSources.metadata?.page} of ${paginatedSources.metadata?.totalPages}`
    );

    // Display the first page of sources
    console.log("\nPage 1 sources:");
    displaySources(paginatedSources.data);

    // Get the second page
    if (paginatedSources.hasNextPage) {
      console.log("\nFetching page 2...");
      const page2 = await paginatedSources.nextPage();
      console.log(
        `Page ${page2.metadata?.page} of ${page2.metadata?.totalPages}`
      );
    }
  } catch (error) {
    console.error("Error running news feed example:", error);
  }
}

// Helper function to display articles
function displayArticles(articles: newsDocument[]) {
  // Handle both direct arrays and APIResponseWithMetadata
  const articlesArray = articles;

  console.log(`Found ${articlesArray.length} articles`);

  articlesArray.forEach((article: newsDocument, index: number) => {
    // Handle missing publishTimeMillis values
    let publishDate = "No date available";
    if (article.publishTimeMillis) {
      try {
        publishDate = new Date(article.publishTimeMillis).toLocaleString();
      } catch (e) {
        publishDate = "Invalid date format";
      }
    }

    console.log(`${index + 1}. ${article.title} (${publishDate})`);
    console.log(`   Source: ${article.source?.sourceName}`);
    if (article.assets && article.assets.length > 0) {
      console.log(
        `   Mentioned assets: ${article.assets
          .map((a: newsAsset) => a.name)
          .join(", ")}`
      );
    }
    console.log(`   URL: ${article.url}`);
    console.log();
  });
}

// Helper function to display assets
function displayAssets(assets: newsAsset[]) {
  const assetsArray = assets;

  console.log(`Found ${assetsArray.length} assets`);

  assetsArray.forEach((asset: newsAsset, index: number) => {
    console.log(`${index + 1}. ${asset.name} (${asset.symbol || "No symbol"})`);
  });
}

// Helper function to display sources
function displaySources(sources: newsSource[]) {
  const sourcesArray = sources;

  console.log(`Found ${sourcesArray.length} sources`);

  sourcesArray.forEach((source: newsSource, index: number) => {
    console.log(`${index + 1}. ${source.sourceName} (${source.sourceType})`);
  });
}

runNewsFeedExample();
