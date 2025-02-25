import { MessariClient } from "@messari-kit/api";
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
  };
}

// Cast the client to include the news property
const typedClient = client as unknown as NewsClient;

async function runNewsFeedExample() {
  try {
    console.log("1. Fetching news feed...");

    // Define the news feed parameters
    const newsFeedParams: getNewsFeedParameters = {
      // Get articles published in the last 7 days
      publishedAfter: (Date.now() - 7 * 24 * 60 * 60 * 1000).toString(),
      // Filter by source type
      sourceTypes: "News",
      // Sort by publish time in descending order (most recent first)
      sort: "2",
      // Limit to 5 articles
      limit: "5",
      // First page
      page: "1",
    };

    // Call the getNewsFeed endpoint
    const articles = await typedClient.news.getNewsFeed(newsFeedParams);

    console.log("News feed response received:");
    console.log(`Found ${articles.length} articles`);

    // Display article titles and publish dates
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

    // Now fetch assets mentioned in news
    console.log("\n2. Fetching assets mentioned in news...");

    const assetsParams: getNewsFeedAssetsParameters = {
      // Optional: Filter by name or symbol
      // nameOrSymbol: "Bitcoin",
      limit: "5",
      page: "1",
    };

    // Call the getNewsFeedAssets endpoint
    const assets = await typedClient.news.getNewsFeedAssets(assetsParams);

    console.log("Assets response received:");
    console.log(`Found ${assets.length} assets`);

    // Display assets
    assets.forEach((asset: Asset, index: number) => {
      console.log(
        `${index + 1}. ${asset.name} (${asset.symbol || "No symbol"})`
      );
    });

    // Finally, fetch news sources
    console.log("\n3. Fetching news sources...");

    const sourcesParams: getNewsSourcesParameters = {
      // Optional: Filter by source name
      // sourceName: "CoinDesk",
      limit: "5",
      page: "1",
    };

    // Call the getNewsSources endpoint
    const sources = await typedClient.news.getNewsSources(sourcesParams);

    console.log("Sources response received:");
    console.log(`Found ${sources.length} sources`);

    // Display sources
    sources.forEach((source: Source, index: number) => {
      console.log(`${index + 1}. ${source.sourceName} (${source.sourceType})`);
    });
  } catch (error) {
    console.error("Error calling news service:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
  }
}

// Run the example
runNewsFeedExample();
