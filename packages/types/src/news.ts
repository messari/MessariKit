/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export type paths = {
  "/news/v1/news/assets": {
    /**
     * Get assets mentioned in news
     * @description Returns a list of assets that are mentioned in news articles.
     * Supports pagination and filtering by asset name or symbol.
     */
    get: operations["getNewsFeedAssets"];
  };
  "/news/v1/news/feed": {
    /**
     * Get news feed
     * @description Returns a list of news articles.
     * Supports pagination and filtering by various parameters.
     */
    get: operations["getNewsFeed"];
  };
  "/news/v1/news/sources": {
    /**
     * Get news sources
     * @description Returns a list of news sources.
     * Supports pagination and filtering by source name.
     */
    get: operations["getNewsSources"];
  };
};

export type webhooks = Record<string, never>;

export type components = {
  schemas: {
    APIError: {
      /**
       * @description Error message when something goes wrong
       * @example Internal server error, please try again
       */
      error: string;
    };
    /** @description Standard response wrapper with additional metadata */
    APIResponseWithMetadata: {
      /** @description Response payload */
      data: Record<string, never>;
      /** @description Error message if request failed */
      error?: string;
      /** @description Additional metadata about the response */
      metadata?: Record<string, never>;
    };
    Asset: {
      /**
       * Format: uuid
       * @description Unique identifier for the asset
       */
      id: string;
      /** @description Name of the asset */
      name: string;
      /** @description Symbol of the asset */
      symbol?: string;
    };
    /** @description List of assets */
    AssetList: components["schemas"]["Asset"][];
    Document: {
      /** @description Assets mentioned in the document */
      assets?: components["schemas"]["Asset"][];
      /** @description Content of the document */
      content?: string;
      /**
       * Format: uuid
       * @description Unique identifier for the document
       */
      id: string;
      /**
       * Format: int64
       * @description Published timestamp in milliseconds UTC
       */
      publishedAt: number;
      /** @description Source of the document */
      source?: components["schemas"]["Source"];
      /** @description Title of the document */
      title: string;
      /**
       * Format: uri
       * @description URL of the document
       */
      url?: string;
    };
    /** @description List of news documents */
    DocumentList: components["schemas"]["Document"][];
    PaginationResult: {
      /** @description Current page number */
      currentPage: number;
      /** @description Number of items per page */
      itemsPerPage: number;
      /** @description Total number of items */
      totalItems: number;
      /** @description Total number of pages */
      totalPages: number;
    };
    Source: {
      /**
       * Format: uuid
       * @description Unique identifier for the source
       */
      id: string;
      /** @description Name of the source */
      sourceName: string;
      /** @description Type of the source */
      sourceType: components["schemas"]["SourceType"];
    };
    /** @description List of news sources */
    SourceList: components["schemas"]["Source"][];
    /**
     * @description Type of news source
     * @enum {string}
     */
    SourceType: "News" | "Forum" | "Blog";
  };
  responses: never;
  parameters: {
    /** @description API key for authentication */
    apiKey: string;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
};

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = {

  /**
   * Get assets mentioned in news
   * @description Returns a list of assets that are mentioned in news articles.
   * Supports pagination and filtering by asset name or symbol.
   */
  getNewsFeedAssets: {
    parameters: {
      query?: {
        /** @description A case-sensitive text to search by asset name, i.e. Bitcoin, or priority symbol, i.e. BTC */
        nameOrSymbol?: string;
        /** @description Number of results per page */
        limit?: number;
        /** @description Page number */
        page?: number;
      };
      header: {
        "x-messari-api-key": components["parameters"]["apiKey"];
      };
    };
    responses: {
      /** @description Client error response */
      "4XX": {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["APIResponseWithMetadata"] & {
            data?: components["schemas"]["AssetList"];
            metadata?: components["schemas"]["PaginationResult"];
          };
        };
      };
    };
  };
  /**
   * Get news feed
   * @description Returns a list of news articles.
   * Supports pagination and filtering by various parameters.
   */
  getNewsFeed: {
    parameters: {
      query?: {
        /** @description Timestamp in milliseconds UTC. If publishedBefore is provided, publishedAfter must be greater. */
        publishedBefore?: number;
        /** @description Timestamp in milliseconds UTC. */
        publishedAfter?: number;
        /** @description List of source types to filter by. If provided, the results will be filtered by these source types. */
        sourceTypes?: ("Blog" | "Forum" | "News")[];
        /** @description List of source IDs to filter by. If provided, the results will be filtered by these source IDs. */
        sourceIds?: string[];
        /** @description List of asset IDs to filter by. If provided, the results will be filtered by these asset IDs. */
        assetIds?: string[];
        /** @description Sort by publish time in ascending or descending order. 2 (DESC) by default. */
        sort?: 1 | 2;
        /** @description Number of results per page */
        limit?: number;
        /** @description Page number */
        page?: number;
      };
      header: {
        "x-messari-api-key": components["parameters"]["apiKey"];
      };
    };
    responses: {
      /** @description Client error response */
      "4XX": {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["APIResponseWithMetadata"] & {
            data?: components["schemas"]["DocumentList"];
            metadata?: components["schemas"]["PaginationResult"];
          };
        };
      };
    };
  };
  /**
   * Get news sources
   * @description Returns a list of news sources.
   * Supports pagination and filtering by source name.
   */
  getNewsSources: {
    parameters: {
      query?: {
        /** @description A case-sensitive text to search by source name, i.e. CoinDesk */
        sourceName?: string;
        /** @description Number of results per page */
        limit?: number;
        /** @description Page number */
        page?: number;
      };
      header: {
        "x-messari-api-key": components["parameters"]["apiKey"];
      };
    };
    responses: {
      /** @description Client error response */
      "4XX": {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["APIResponseWithMetadata"] & {
            data?: components["schemas"]["SourceList"];
            metadata?: components["schemas"]["PaginationResult"];
          };
        };
      };
    };
  };
};
