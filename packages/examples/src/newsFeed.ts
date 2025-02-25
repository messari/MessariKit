import {
  MessariClient,
  PaginatedResult,
  PaginationMetadata,
} from "@messari-kit/api";
import {
  getNewsFeedParameters,
  getNewsFeedAssetsParameters,
  getNewsSourcesParameters,
  getNewsFeedResponse,
  getNewsFeedAssetsResponse,
  getNewsSourcesResponse,
} from "@messari-kit/types";

// Define interfaces for type safety
interface Asset {
  id: string;
  name: string;
  symbol?: string;
}

interface Source {
  id: string;
  sourceName: string;
  sourceType: string;
}

interface Document {
  id: string;
  title: string;
  content?: string;
  url?: string;
  publishedAt: number;
  source?: Source;
  assets?: Asset[];
}

// Stub API key (replace with your actual API key in a real application)
const API_KEY = "<your-api-key-here>";

// Initialize the Messari client
const client = new MessariClient({
  apiKey: API_KEY,
  // Optional: Override the base URL if needed
  // baseUrl: "https://api.messari.io",
});

// Type assertion to add the news property to the client
// This is necessary because the TypeScript definitions might not be updated yet
interface NewsClient {
  news: {
    getNewsFeed: (
      params: getNewsFeedParameters
    ) => Promise<getNewsFeedResponse>;
    getNewsFeedAssets: (
      params: getNewsFeedAssetsParameters
    ) => Promise<getNewsFeedAssetsResponse>;
    getNewsSources: (
      params: getNewsSourcesParameters
    ) => Promise<getNewsSourcesResponse>;
    getNewsFeedPaginated: (
      params: getNewsFeedParameters
    ) => Promise<PaginatedResult<getNewsFeedResponse, getNewsFeedParameters>>;
    getNewsFeedAssetsPaginated: (
      params: getNewsFeedAssetsParameters
    ) => Promise<
      PaginatedResult<getNewsFeedAssetsResponse, getNewsFeedAssetsParameters>
    >;
    getNewsSourcesPaginated: (
      params: getNewsSourcesParameters
    ) => Promise<
      PaginatedResult<getNewsSourcesResponse, getNewsSourcesParameters>
    >;
  };
}

// Cast the client to include the news property
const typedClient = client as unknown as NewsClient;

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
    const paginatedArticles = await typedClient.news.getNewsFeedPaginated(
      newsFeedParams
    );

    // Display pagination metadata
    console.log("Pagination metadata:", paginatedArticles.metadata);
    console.log(
      `Page ${paginatedArticles.metadata?.page} of ${paginatedArticles.metadata?.totalPages}`
    );
    console.log(`Has next page: ${paginatedArticles.hasNextPage}`);
    console.log(`Has previous page: ${paginatedArticles.hasPreviousPage}`);
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
      // Optional: Filter by name or symbol
      // nameOrSymbol: "Bitcoin",
      limit: "10",
      page: "1",
    };

    // Call the getNewsFeedAssetsPaginated endpoint
    const paginatedAssets = await typedClient.news.getNewsFeedAssetsPaginated(
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

      // Get the third page
      if (page2.hasNextPage) {
        console.log("\nFetching page 3...");
        const page3 = await page2.nextPage();
        console.log(
          `Page ${page3.metadata?.page} of ${page3.metadata?.totalPages}`
        );
        displayAssets(page3.data);
      }
    }

    // Finally, fetch news sources with pagination
    console.log("\n3. Fetching news sources with pagination...");

    const sourcesParams: getNewsSourcesParameters = {
      // Optional: Filter by source name
      // sourceName: "CoinDesk",
      limit: "10",
      page: "1",
    };

    // Call the getNewsSourcesPaginated endpoint
    const paginatedSources = await typedClient.news.getNewsSourcesPaginated(
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
      displaySources(page2.data);

      // Get the third page
      if (page2.hasNextPage) {
        console.log("\nFetching page 3...");
        const page3 = await page2.nextPage();
        console.log(
          `Page ${page3.metadata?.page} of ${page3.metadata?.totalPages}`
        );
        displaySources(page3.data);
      }
    }
  } catch (error) {
    console.error("Error calling news service:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
  }
}

// Helper function to display articles
function displayArticles(articles: Document[]) {
  console.log(`Found ${articles.length} articles`);

  articles.forEach((article: Document, index: number) => {
    const publishDate = new Date(article.publishedAt).toLocaleString();
    console.log(`${index + 1}. ${article.title} (${publishDate})`);
    console.log(`   Source: ${article.source?.sourceName}`);
    if (article.assets && article.assets.length > 0) {
      console.log(
        `   Mentioned assets: ${article.assets
          .map((a: Asset) => a.name)
          .join(", ")}`
      );
    }
    console.log(`   URL: ${article.url}`);
    console.log();
  });
}

// Helper function to display assets
function displayAssets(assets: Asset[]) {
  console.log(`Found ${assets.length} assets`);

  assets.forEach((asset: Asset, index: number) => {
    console.log(`${index + 1}. ${asset.name} (${asset.symbol || "No symbol"})`);
  });
}

// Helper function to display sources
function displaySources(sources: Source[]) {
  console.log(`Found ${sources.length} sources`);

  sources.forEach((source: Source, index: number) => {
    console.log(`${index + 1}. ${source.sourceName} (${source.sourceType})`);
  });
}

// Run the example
runNewsFeedExample();
