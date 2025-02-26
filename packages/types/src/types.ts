/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export type paths = {
  "/ai/v1/chat/completions": {
    /**
     * Create a chat completion
     * @description Creates a completion for the chat message. Supports both streaming and non-streaming responses.
     * The last message must be from the user role.
     */
    post: operations["createChatCompletion"];
  };
  "/ai/v1/classification/extraction": {
    /**
     * Extract entities from text
     * @description Extracts entities from the provided text content using AI models and database lookups.
     * Supports various entity types and can return similar entities based on the extracted names.
     */
    post: operations["extractEntities"];
  };
  [path: `/api/v1/markets/metrics/${string}/ath-data`]: {
    /**
     * Returns a single asset's ATH data
     * @description Returns a single asset's ATH data
     */
    get: operations["getAssetATH"];
  };
  [path: `/api/v1/markets/metrics/${string}/price`]: {
    /**
     * Returns a single asset's market data
     * @description Returns a single asset's market data
     */
    get: operations["getAssetPrice"];
  };
  [path: `/api/v1/markets/metrics/${string}/roi-data`]: {
    /**
     * Returns a single asset's ROI data
     * @description Returns a single asset's ROI data
     */
    get: operations["getAssetROI"];
  };
  "/api/v1/markets/metrics/ath-data": {
    /**
     * Returns a list of all time high data for all assets
     * @description Returns a list of all time high data for all assets
     */
    get: operations["getAssetsATH"];
  };
  "/api/v1/markets/metrics/roi-data": {
    /**
     * Returns a list ROI data for all assets
     * @description Returns a list ROI data for all assets
     */
    get: operations["getAssetsROI"];
  };
  "/intel/v1/assets": {
    /**
     * Get all assets
     * @description Returns a list of assets.
     * Supports pagination and filtering by name or symbol.
     */
    get: operations["getAllAssets"];
  };
  "/intel/v1/events": {
    /**
     * Get all events
     * @description Returns a list of events based on the provided filters.
     * Supports pagination and filtering by various parameters.
     */
    post: operations["getAllEvents"];
  };
  [path: `/intel/v1/events/${string}`]: {
    /**
     * Get event and its history
     * @description Returns a specific event by ID along with its history.
     */
    get: operations["getEventAndHistory"];
  };
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
    /**
     * @description Standard response wrapper with additional metadata.
     * This type should be treated as generic in TypeScript: APIResponseWithMetadata<T, M>.
     * T represents the data type, M represents the metadata type.
     */
    APIResponseWithMetadata: {
      /** @description Response payload */
      data: Record<string, never>;
      /** @description Error message if request failed */
      error?: string;
      /** @description Additional metadata about the response */
      metadata?: Record<string, never>;
    };
    Asset: {
      /** @description Unique identifier for the asset */
      id: string;
      /** @description Name of the asset */
      name: string;
      /** @description Slug of the asset */
      slug: string;
      /** @description Symbol of the asset */
      symbol: string;
    };
    /** @description List of assets */
    AssetList: components["schemas"]["NewsAsset"][];
    AssetMarketcap: {
      /** Format: double */
      circulatingUsd?: number;
      /** Format: double */
      dominance?: number;
      /** Format: double */
      fullyDilutedUsd?: number;
    };
    AssetMarketData: {
      lastPriceAt?: components["schemas"]["TimeUTC"];
      lastTradeAt?: components["schemas"]["TimeUTC"];
      marketcap?: components["schemas"]["AssetMarketcap"];
      ohlcv1Hour?: components["schemas"]["OHLCV"];
      ohlcv24Hours?: components["schemas"]["OHLCV"];
      /** Format: double */
      percentChangeBtc1Hour?: number;
      /** Format: double */
      percentChangeBtc24Hours?: number;
      /** Format: double */
      percentChangeEth1Hour?: number;
      /** Format: double */
      percentChangeEth24Hours?: number;
      /** Format: double */
      percentChangeUsd1Hour?: number;
      /** Format: double */
      percentChangeUsd24Hours?: number;
      /** Format: double */
      priceBtc?: number;
      /** Format: double */
      priceEth?: number;
      /** Format: double */
      priceUsd?: number;
      /** Format: double */
      realVolume24Hours?: number;
      supply?: components["schemas"]["AssetSupply"];
      /** Format: double */
      volume24Hours?: number;
      /** Format: double */
      volume24HoursOverstatementMultiple?: number;
    };
    AssetSupply: {
      /** Format: double */
      circulating?: number;
      /** Format: double */
      max?: number;
      /** Format: double */
      total?: number;
    };
    AssetWithATHData: {
      asset?: components["schemas"]["schemas-Asset"];
      athData?: {
        /** Format: double */
        percentDown?: number;
        /** Format: double */
        price?: number;
        timestamp?: components["schemas"]["TimeUTC"];
      };
    };
    AssetWithROIData: {
      asset?: components["schemas"]["schemas-Asset"];
      roiData?: components["schemas"]["ROIData"];
    };
    ChatCompletionMessage: {
      /** @description The message content */
      content: string;
      /**
       * @description The role of the message sender
       * @enum {string}
       */
      role: "system" | "user" | "assistant";
    };
    ChatCompletionRequest: {
      /** @description Array of messages in the conversation */
      messages: components["schemas"]["ChatCompletionMessage"][];
      /**
       * @description Desired format of the response
       * @enum {string}
       */
      response_format?: "text" | "json" | "markdown";
      /**
       * @description Whether to stream the response
       * @default false
       */
      stream?: boolean;
      /**
       * @description Controls how verbose the response should be
       * @enum {string}
       */
      verbosity?: "concise" | "normal" | "detailed";
    };
    ChatCompletionResponse: {
      /** @description Array of response messages */
      messages: components["schemas"]["ChatCompletionMessage"][];
    };
    ChatCompletionResponseMetadata: {
      /** @description Current status of the chat completion */
      status: string;
    };
    Document: {
      /** @description Assets mentioned in the document */
      assets?: components["schemas"]["NewsAsset"][];
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
      publishTimeMillis: number;
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
    Entity: {
      /**
       * Format: float
       * @description Confidence score of the entity match
       */
      confidence?: number;
      /** @description Unique identifier for the entity */
      id?: string;
      /** @description Name of the entity */
      name?: string;
      type?: components["schemas"]["EntityType"];
    };
    /**
     * @description Type of entity being extracted or referenced
     * @enum {string}
     */
    EntityType: "acquired_entity" | "acquiring_entity" | "asset" | "x_user" | "funded_entity" | "investor" | "network" | "person" | "exchange" | "organization" | "project" | "protocol" | "nft_collection";
    Event: {
      /** @description Block number when the event activates */
      activationBlock?: number | null;
      /** @description Category of the event */
      category: string;
      /** @description Date when the event occurred or will occur */
      eventDate?: string | null;
      /** @description Detailed description of the event */
      eventDetails: string;
      /** @description Name of the event */
      eventName: string;
      /** @description Whether the event is global */
      globalEvent: boolean;
      /** @description Unique identifier for the event */
      id: string;
      /** @description Importance level of the event */
      importance: string;
      /** @description Primary assets related to the event */
      primaryAssets: components["schemas"]["Asset"][];
      /** @description Resources related to the event */
      resources?: components["schemas"]["Resource"][];
      /** @description Secondary assets related to the event */
      secondaryAssets?: components["schemas"]["Asset"][];
      /** @description Current status of the event */
      status: string;
      /** @description Subcategory of the event */
      subcategory: string;
      /**
       * Format: date-time
       * @description Date when the event was submitted
       */
      submissionDate: string;
      /** @description Tag associated with the event */
      tag: string;
      /** @description Details about the latest update to the event */
      updateDetails?: string | null;
    };
    EventHistory: {
      /** @description Importance level at this point in history */
      importance: string;
      /** @description Status at this point in history */
      status: string;
      /**
       * Format: date-time
       * @description Date when the history entry was submitted
       */
      submissionDate: string;
      /** @description Details about the update */
      updateDetails?: string | null;
    };
    ExtractRequest: {
      /**
       * @description Whether to return all similar entities or just the best matches
       * @default false
       */
      allSimilarEntities?: boolean;
      /** @description Text content to extract entities from */
      content: string;
      /** @description Types of entities to extract */
      entityTypes?: components["schemas"]["EntityType"][];
    };
    ExtractResponse: {
      /** @description List of extracted entities with their matches */
      extractedEntities: components["schemas"]["GroupedEntity"][];
    };
    ExtractResponseMetadata: {
      /** @description Current status of the extraction request */
      status?: string;
    };
    GetAllEventsRequest: {
      /** @description Filter by categories */
      category?: string[];
      /**
       * Format: date-time
       * @description Filter events before this time
       */
      endTime?: string;
      /** @description Filter by whether the event is global */
      globalEvent?: boolean | null;
      /** @description Filter by importance levels */
      importance?: string[];
      /**
       * @description Number of items per page
       * @default 20
       */
      limit?: number;
      /**
       * @description Page number for pagination
       * @default 1
       */
      page?: number;
      /** @description Filter by primary assets */
      primaryAssets?: string[];
      /** @description Filter by assets that are either primary or secondary */
      primaryOrSecondaryAssets?: string[];
      /** @description Filter by secondary assets */
      secondaryAssets?: string[];
      /**
       * Format: date-time
       * @description Filter events after this time
       */
      startTime?: string;
      /** @description Filter by status */
      status?: string[];
      /** @description Filter by subcategories */
      subcategory?: string[];
      /** @description Filter by tags */
      tag?: string[];
    };
    GetEventResponse: {
      /** @description The event details */
      event: components["schemas"]["Event"];
      /** @description History of the event */
      eventHistory: components["schemas"]["EventHistory"][];
    };
    GroupedEntity: {
      /** @description The name extracted from the content */
      extractedName?: string;
      /** @description The selected/best matching entity if available */
      selectedEntity?: components["schemas"]["Entity"];
      /** @description List of similar entities found */
      similarEntities?: components["schemas"]["Entity"][];
    };
    MarketDataAsset: components["schemas"]["schemas-Asset"];
    MarketDataAssetMarketcap: components["schemas"]["AssetMarketcap"];
    MarketDataAssetMarketData: components["schemas"]["AssetMarketData"];
    MarketDataAssetSupply: components["schemas"]["AssetSupply"];
    MarketDataAssetWithATHData: components["schemas"]["AssetWithATHData"];
    MarketDataAssetWithROIData: components["schemas"]["AssetWithROIData"];
    MarketDataOHLCV: components["schemas"]["OHLCV"];
    MarketDataPlatformContract: components["schemas"]["PlatformContract"];
    MarketDataROIData: components["schemas"]["ROIData"];
    MarketDataTimeUTC: components["schemas"]["TimeUTC"];
    NewsAsset: {
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
    OHLCV: {
      /** Format: double */
      close?: number;
      /** Format: double */
      high?: number;
      /** Format: double */
      low?: number;
      /** Format: double */
      open?: number;
      timestamp?: components["schemas"]["TimeUTC"];
      /** Format: double */
      volume?: number;
    };
    /** @description Pagination metadata for list endpoints */
    PaginationResult: {
      /**
       * @description Whether there are more pages available
       * @example true
       */
      hasMore?: boolean;
      /**
       * @description Number of items per page
       * @example 20
       */
      limit?: number;
      /**
       * @description Current page number
       * @example 1
       */
      page?: number;
      /**
       * @description Total number of items available
       * @example 100
       */
      total?: number;
    };
    PlatformContract: {
      contractAddress?: string;
      platform?: string;
    };
    Resource: {
      /** @description Title of the resource */
      title?: string;
      /**
       * Format: uri
       * @description URL of the resource
       */
      url?: string;
    };
    ROIData: {
      /** Format: double */
      percentChange1Month?: number;
      /** Format: double */
      percentChange1Week?: number;
      /** Format: double */
      percentChange1Year?: number;
      /** Format: double */
      percentChange3Months?: number;
      /** Format: double */
      percentChangeBtc1Month?: number;
      /** Format: double */
      percentChangeBtc1Week?: number;
      /** Format: double */
      percentChangeBtc1Year?: number;
      /** Format: double */
      percentChangeBtc3Months?: number;
      /** Format: double */
      percentChangeEth1Month?: number;
      /** Format: double */
      percentChangeEth1Week?: number;
      /** Format: double */
      percentChangeEth1Year?: number;
      /** Format: double */
      percentChangeEth3Months?: number;
      /** Format: double */
      percentChangeMonthToDate?: number;
      /** Format: double */
      percentChangeQuarterToDate?: number;
      /** Format: double */
      percentChangeYearToDate?: number;
    };
    "schemas-Asset": {
      contractAddresses?: components["schemas"]["PlatformContract"][];
      id?: string;
      name?: string;
      /** Format: int32 */
      serialId?: number;
      slug?: string;
      symbol?: string;
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
    /**
     * Format: date-time
     * @description UTC timestamp
     */
    TimeUTC: string;
  };
  responses: never;
  parameters: {
    /** @description API key for authentication */
    apiKey: string;
    /** @description Number of items per page */
    limit?: number;
    /** @description Page number for pagination (1-based) */
    page?: number;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
};

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = {

  /**
   * Create a chat completion
   * @description Creates a completion for the chat message. Supports both streaming and non-streaming responses.
   * The last message must be from the user role.
   */
  createChatCompletion: {
    parameters: {
      header: {
        "x-messari-api-key": components["parameters"]["apiKey"];
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ChatCompletionRequest"];
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
            data?: components["schemas"]["ChatCompletionResponse"];
            metadata?: components["schemas"]["ChatCompletionResponseMetadata"];
          };
          "text/event-stream": string;
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
  /**
   * Extract entities from text
   * @description Extracts entities from the provided text content using AI models and database lookups.
   * Supports various entity types and can return similar entities based on the extracted names.
   */
  extractEntities: {
    parameters: {
      header: {
        "x-messari-api-key": components["parameters"]["apiKey"];
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ExtractRequest"];
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
            data?: components["schemas"]["ExtractResponse"];
            metadata?: components["schemas"]["ExtractResponseMetadata"];
          };
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
  /**
   * Returns a single asset's ATH data
   * @description Returns a single asset's ATH data
   */
  getAssetATH: {
    parameters: {
      path: {
        /** @description Asset ID */
        assetId: string;
      };
    };
    responses: {
      /** @description Client error response */
      "4XX": {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
      /** @description Successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["AssetWithATHData"];
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
  /**
   * Returns a single asset's market data
   * @description Returns a single asset's market data
   */
  getAssetPrice: {
    parameters: {
      path: {
        /** @description Asset ID */
        assetId: string;
      };
    };
    responses: {
      /** @description Client error response */
      "4XX": {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
      /** @description Successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["AssetMarketData"];
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
  /**
   * Returns a single asset's ROI data
   * @description Returns a single asset's ROI data
   */
  getAssetROI: {
    parameters: {
      path: {
        /** @description Asset ID */
        assetId: string;
      };
    };
    responses: {
      /** @description Client error response */
      "4XX": {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
      /** @description Successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["AssetWithROIData"];
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
  /**
   * Returns a list of all time high data for all assets
   * @description Returns a list of all time high data for all assets
   */
  getAssetsATH: {
    responses: {
      /** @description Client error response */
      "4XX": {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
      /** @description Successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["AssetWithATHData"][];
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
  /**
   * Returns a list ROI data for all assets
   * @description Returns a list ROI data for all assets
   */
  getAssetsROI: {
    responses: {
      /** @description Client error response */
      "4XX": {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
      /** @description Successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["AssetWithROIData"][];
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
  /**
   * Get all assets
   * @description Returns a list of assets.
   * Supports pagination and filtering by name or symbol.
   */
  getAllAssets: {
    parameters: {
      query?: {
        page?: components["parameters"]["page"];
        limit?: components["parameters"]["limit"];
        /** @description Filter by asset symbols (comma-separated) */
        symbol?: string;
        /** @description Filter by asset names (comma-separated) */
        name?: string;
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
            data?: components["schemas"]["Asset"][];
            metadata?: components["schemas"]["PaginationResult"];
          };
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
  /**
   * Get all events
   * @description Returns a list of events based on the provided filters.
   * Supports pagination and filtering by various parameters.
   */
  getAllEvents: {
    parameters: {
      header: {
        "x-messari-api-key": components["parameters"]["apiKey"];
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["GetAllEventsRequest"];
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
            data?: components["schemas"]["Event"][];
            metadata?: components["schemas"]["PaginationResult"];
          };
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
  /**
   * Get event and its history
   * @description Returns a specific event by ID along with its history.
   */
  getEventAndHistory: {
    parameters: {
      header: {
        "x-messari-api-key": components["parameters"]["apiKey"];
      };
      path: {
        /** @description ID of the event to retrieve */
        eventId: string;
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
            data?: components["schemas"]["GetEventResponse"];
          };
        };
      };
      /** @description Server error response */
      500: {
        content: {
          "application/json": components["schemas"]["APIError"];
        };
      };
    };
  };
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
