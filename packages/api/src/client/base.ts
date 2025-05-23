import type {
  createChatCompletionParameters,
  createChatCompletionResponse,
  extractEntitiesParameters,
  extractEntitiesResponse,
  getNewsFeedParameters,
  getNewsFeedResponse,
  getNewsSourcesParameters,
  getNewsSourcesResponse,
  getNewsFeedAssetsParameters,
  getNewsFeedAssetsResponse,
  getAllEventsParameters,
  getEventAndHistoryParameters,
  getEventAndHistoryResponse,
  getAllAssetsParameters,
  getAllAssetsResponse,
  getAllEventsResponse,
  getProjectRecapParameters,
  getExchangeRankingsRecapResponse,
  getExchangeRecapParameters,
  getExchangeRecapResponse,
  getProjectRecapResponse,
  APIResponseWithMetadata,
  getPreviewsResponse,
  getReportByAssetIDParameters,
  getReportByAssetIDResponse,
  getResearchReportsParameters,
  getResearchReportsResponse,
  getResearchReportByIdParameters,
  getResearchReportByIdResponse,
  getResearchReportTagsResponse,
  getFundingRoundsParameters,
  FundingRound,
  getFundingRoundsInvestorsParameters,
  Investors,
  getAcquisitionDealsParameters,
  Organization,
  Project,
  getTokenUnlockSupportedAssetsParameters,
  getTokenUnlockSupportedAssetsResponse,
  getTokenUnlockAllocationsParameters,
  getTokenUnlockAllocationsResponse,
  getTokenUnlockVestingScheduleParameters,
  getTokenUnlockVestingScheduleResponse,
  getTokenUnlocksParameters,
  getTokenUnlocksResponse,
  getTokenUnlockEventsParameters,
  getTokenUnlockEventsResponse,
  AcquisitionDeal,
  getOrganizationsParameters,
  getProjectsParameters,
  getAssetsV2Parameters,
  getAssetsV2Response,
  getAssetDetailsParameters,
  getAssetDetailsResponse,
  getAssetsTimeseriesCatalogResponse,
  getAssetsV2ATHParameters,
  getAssetsV2ATHResponse,
  getAssetsV2ROIParameters,
  getAssetsV2ROIResponse,
  getAssetTimeseriesParameters,
  getAssetTimeseriesResponse,
  getAssetTimeseriesWithGranularityParameters,
  getAssetTimeseriesWithGranularityResponse,
  TimeseriesMetadata,
  getExchangesParameters,
  getExchangesResponse,
  getExchangeParameters,
  getExchangeResponse,
  getExchangeTimeseriesParameters,
  getExchangeTimeseriesResponse,
  getExchangeMetricsResponse,
  getNetworkTimeseriesResponse,
  getNetworkTimeseriesParameters,
  getNetworkMetricsResponse,
  getMarketMetricsResponse,
  getMarketTimeseriesParameters,
  getMarketTimeseriesResponse,
  getNetworksParameters,
  getNetworksResponse,
  getNetworkParameters,
  getNetworkResponse,
  getMarketsResponse,
  getMarketsParameters,
  getMarketResponse,
  getMarketParameters,
  createWatchlistResponse,
  createWatchlistParameters,
  getWatchlistParameters,
  listWatchlistsResponse,
  getWatchlistResponse,
  updateWatchlistResponse,
  updateWatchlistParameters,
  deleteWatchlistParameters,
  deleteWatchlistResponse,
  modifyWatchlistAssetsParameters,
  modifyWatchlistAssetsResponse,
  getTeamAllowanceResponse,
  getPermissionsResponse,
  createChatCompletionOpenAIResponse,
} from "../types";
import { LogLevel, type Logger, makeConsoleLogger, createFilteredLogger, noOpLogger } from "../logging";
import type { PaginatedResult, RequestOptions, ClientEventMap, ClientEventType, ClientEventHandler } from "./types";

/**
 * Interface for the AI API methods
 */
export interface AIInterface {
  /**
   * Creates a chat completion using OpenAI's API
   * @param params Parameters for the chat completion request
   * @param options Optional request configuration
   * @returns A promise resolving to the chat completion response
   */
  createChatCompletion(params: Omit<createChatCompletionParameters, "stream">, options?: RequestOptions): Promise<createChatCompletionOpenAIResponse>;

  /**
   * Creates a streaming chat completion using OpenAI's API
   * @param params Parameters for the chat completion request
   * @param options Optional request configuration
   * @returns A promise resolving to a readable stream of chat completion chunks
   */
  createChatCompletionStream(
    params: Omit<createChatCompletionParameters, "stream">,
    options?: RequestOptions,
  ): Promise<ReadableStream<createChatCompletionOpenAIResponse>>;

  /**
   * Extracts entities from text content
   * @param params Parameters for entity extraction
   * @param options Optional request configuration
   * @returns A promise resolving to the extracted entities
   */
  extractEntities(params: extractEntitiesParameters, options?: RequestOptions): Promise<extractEntitiesResponse>;
}

/**
 * Interface for the Asset API methods
 */
export interface AssetInterface {
  /**
   * Gets a paginated list of assets with extended information and coverage details (V2)
   * @param params Parameters for filtering assets including coverage options
   * @param options Optional request configuration
   * @returns A paginated result of assets with extended information
   */
  getAssetsV2(params?: getAssetsV2Parameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getAssetsV2Response>>;

  /**
   * Gets detailed information for specific assets by IDs or slugs
   * @param params Parameters including asset IDs or slugs
   * @param options Optional request configuration
   * @returns Promise resolving to detailed asset information
   */
  getAssetDetails(params: getAssetDetailsParameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getAssetDetailsResponse>>;

  /**
   * Gets a catalog of available timeseries datasets and metrics for assets
   * @param options Optional request configuration
   * @returns Promise resolving to timeseries catalog information
   */
  getAssetsTimeseriesCatalog(options?: RequestOptions): Promise<APIResponseWithMetadata<getAssetsTimeseriesCatalogResponse>>;

  /**
   * Gets all-time high information for assets with various filtering options
   * @param params Parameters for filtering assets
   * @param options Optional request configuration
   * @returns A paginated result of assets with ATH information
   */
  getAssetsV2ATH(params?: getAssetsV2ATHParameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getAssetsV2ATHResponse>>;

  /**
   * Gets return on investment information for assets with various filtering options
   * @param params Parameters for filtering assets
   * @param options Optional request configuration
   * @returns A paginated result of assets with ROI information
   */
  getAssetsV2ROI(params?: getAssetsV2ROIParameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getAssetsV2ROIResponse>>;

  /**
   * Gets timeseries data for a specific asset and dataset
   * @param params Parameters including asset identifier and dataset slug
   * @param options Optional request configuration
   * @returns Promise resolving to timeseries data
   */
  getAssetTimeseries(
    params: getAssetTimeseriesParameters,
    options?: RequestOptions,
  ): Promise<APIResponseWithMetadata<getAssetTimeseriesResponse, TimeseriesMetadata>>;

  /**
   * Gets timeseries data for a specific asset and dataset with specific time granularity
   * @param params Parameters including asset identifier, dataset slug, and granularity
   * @param options Optional request configuration
   * @returns Promise resolving to timeseries data
   */
  getAssetTimeseriesWithGranularity(
    params: getAssetTimeseriesWithGranularityParameters,
    options?: RequestOptions,
  ): Promise<APIResponseWithMetadata<getAssetTimeseriesWithGranularityResponse, TimeseriesMetadata>>;
}

/**
 * Interface for the Exchanges API methods
 */
export interface ExchangesInterface {
  /**
   * Gets a list of all exchanges
   * @param params Parameters for filtering exchanges
   * @param options Optional request configuration
   * @returns A paginated result of exchanges
   */
  getExchanges(params?: getExchangesParameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getExchangesResponse>>;

  /**
   * Gets a specific exchange by ID
   * @param params Parameters for the exchange ID
   * @param options Optional request configuration
   * @returns A promise resolving to the exchange
   */
  getExchangeById(params: getExchangeParameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getExchangeResponse>>;

  /**
   * Gets a list of all metrics for an exchange
   * @param params Parameters for the exchange ID
   * @param options Optional request configuration
   * @returns A promise resolving to the metrics
   */
  getExchangeMetrics(options?: RequestOptions): Promise<APIResponseWithMetadata<getExchangeMetricsResponse>>;

  /**
   * Gets timeseries data for a specific exchange and metric group
   * @param params Parameters for the exchange ID and metric group
   * @param options Optional request configuration
   * @returns A promise resolving to the timeseries data
   */
  getExchangeTimeseries(
    params: getExchangeTimeseriesParameters,
    options?: RequestOptions,
  ): Promise<APIResponseWithMetadata<getExchangeTimeseriesResponse, TimeseriesMetadata>>;
}

/**
 * Interface for the Networks API methods
 */
export interface NetworksInterface {
  /**
   * Gets a list of all networks
   * @param params Parameters for filtering networks
   * @param options Optional request configuration
   * @returns A paginated result of networks
   */
  getNetworks(params?: getNetworksParameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getNetworksResponse>>;

  /**
   * Gets a specific exchange by ID
   * @param params Parameters for the exchange ID
   * @param options Optional request configuration
   * @returns A promise resolving to the exchange
   */
  getNetworkById(params: getNetworkParameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getNetworkResponse>>;

  /**
   * Gets a list of all metrics for an network
   * @param params Parameters for the network ID
   * @param options Optional request configuration
   * @returns A promise resolving to the metrics
   */
  getNetworkMetrics(options?: RequestOptions): Promise<APIResponseWithMetadata<getNetworkMetricsResponse>>;

  /**
   * Gets timeseries data for a specific network and metric group
   * @param params Parameters for the network ID and metric group
   * @param options Optional request configuration
   * @returns A promise resolving to the timeseries data
   */
  getNetworkTimeseries(
    params: getNetworkTimeseriesParameters,
    options?: RequestOptions,
  ): Promise<APIResponseWithMetadata<getNetworkTimeseriesResponse, TimeseriesMetadata>>;
}

/**
 * Interface for the Markets API methods
 */
export interface MarketsInterface {
  /**
   * Gets a list of all markets
   * @param params Parameters for filtering markets
   * @param options Optional request configuration
   * @returns A paginated result of markets
   */
  getMarkets(params?: getMarketsParameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getMarketsResponse>>;

  /**
   * Gets a specific market by ID
   * @param params Parameters for the market ID
   * @param options Optional request configuration
   * @returns A promise resolving to the market
   */
  getMarketById(params: getMarketParameters, options?: RequestOptions): Promise<APIResponseWithMetadata<getMarketResponse>>;

  /**
   * Gets a list of all metrics for an Market
   * @param params Parameters for the Market ID
   * @param options Optional request configuration
   * @returns A promise resolving to the metrics
   */
  getMarketMetrics(options?: RequestOptions): Promise<APIResponseWithMetadata<getMarketMetricsResponse>>;

  /**
   * Gets timeseries data for a specific Market and metric group
   * @param params Parameters for the Market ID and metric group
   * @param options Optional request configuration
   * @returns A promise resolving to the timeseries data
   */
  getMarketTimeseries(
    params: getMarketTimeseriesParameters,
    options?: RequestOptions,
  ): Promise<APIResponseWithMetadata<getMarketTimeseriesResponse, TimeseriesMetadata>>;
}

/**
 * Interface for the Intel API methods
 */
export interface IntelInterface {
  /**
   * Gets all events based on provided filters
   * @param params Parameters for filtering events
   * @param options Optional request configuration
   * @returns A paginated result of events
   */
  getAllEvents(params?: getAllEventsParameters, options?: RequestOptions): Promise<PaginatedResult<getAllEventsResponse["data"], getAllEventsParameters>>;

  /**
   * Gets a specific event by ID along with its history
   * @param params Parameters including the event ID
   * @param options Optional request configuration
   * @returns A promise resolving to the event and its history
   */
  getById(params: getEventAndHistoryParameters, options?: RequestOptions): Promise<getEventAndHistoryResponse>;

  /**
   * Gets all assets with optional filtering
   * @param params Parameters for filtering assets
   * @param options Optional request configuration
   * @returns A paginated result of assets
   */
  getAllAssets(params?: getAllAssetsParameters, options?: RequestOptions): Promise<PaginatedResult<getAllAssetsResponse["data"], getAllAssetsParameters>>;
}

/**
 * Interface for the News API methods
 */
export interface NewsInterface {
  /**
   * Gets news feed with pagination
   * @param params Parameters for filtering news
   * @param options Optional request configuration
   * @returns A paginated result of news items
   */
  getNewsFeedPaginated(params: getNewsFeedParameters, options?: RequestOptions): Promise<PaginatedResult<getNewsFeedResponse["data"], getNewsFeedParameters>>;

  /**
   * Gets assets mentioned in news with pagination
   * @param params Parameters for filtering assets in news
   * @param options Optional request configuration
   * @returns A paginated result of assets mentioned in news
   */
  getNewsFeedAssetsPaginated(
    params: getNewsFeedAssetsParameters,
    options?: RequestOptions,
  ): Promise<PaginatedResult<getNewsFeedAssetsResponse["data"], getNewsFeedAssetsParameters>>;

  /**
   * Gets news sources with pagination
   * @param params Parameters for filtering news sources
   * @param options Optional request configuration
   * @returns A paginated result of news sources
   */
  getNewsSourcesPaginated(
    params: getNewsSourcesParameters,
    options?: RequestOptions,
  ): Promise<PaginatedResult<getNewsSourcesResponse["data"], getNewsSourcesParameters>>;
}

/**
 * Interface for the recaps API endpoints
 */
export interface RecapsAPIInterface {
  /**
   * Gets the latest recaps for a given project across all the time periods 1D, 7D, 30D, 90D
   * @param params.project_id The project ID to get the recap for
   * @return The recaps for the given project
   */
  getProjectRecap(params: getProjectRecapParameters): Promise<getProjectRecapResponse>;

  /**
   * Gets the detailed recap for a single exchange. Includes performance summary, volume data, and news items with summaries
   * @param params.exchange_id The exchange ID to get the recap for
   * @return The recap for the given exchange
   */
  getExchangeRecap(params: getExchangeRecapParameters): Promise<getExchangeRecapResponse>;

  /**
   * Gets overall performance summary for all exchanges, their ranking by volume and news items with summaries
   * @return The exchange rankings recap
   */
  getExchangeRankingsRecap(): Promise<getExchangeRankingsRecapResponse>;
}

/**
 * Interface for the Research API methods
 */
export interface ResearchInterface {
  /**
   * Gets research reports with optional filtering
   * @param params Parameters for filtering research reports
   * @param options Optional request configuration
   * @returns A promise resolving to the research reports
   */
  getResearchReports(params: getResearchReportsParameters, options?: RequestOptions): Promise<getResearchReportsResponse>;

  /**
   * Gets a specific research report by ID
   * @param params Parameters including the report ID
   * @param options Optional request configuration
   * @returns A promise resolving to the research report
   */
  getResearchReportById(params: getResearchReportByIdParameters, options?: RequestOptions): Promise<getResearchReportByIdResponse>;

  /**
   * Gets all available research report tags
   * @param options Optional request configuration
   * @returns A promise that resolves when the operation completes
   */
  getResearchReportTags(options?: RequestOptions): Promise<getResearchReportTagsResponse>;
}

/**
 * Interface for the User Management API methods
 */
export interface UserManagementInterface {
  /**
   * Get a team's current credit allowance
   * @param options Optional request configuration
   * @returns A promise resolving to the team's credit allowance information
   */
  getTeamAllowance(options?: RequestOptions): Promise<getTeamAllowanceResponse>;

  /**
   * Get all permissions with active status for the current user
   * @param options Optional request configuration
   * @returns A promise resolving to the user's permissions
   */
  getPermissions(options?: RequestOptions): Promise<getPermissionsResponse>;

  /**
   * Get all watchlists for the authenticated user
   * @param options Optional request configuration
   * @returns A promise resolving to the user's watchlists
   */
  listWatchlists(options?: RequestOptions): Promise<listWatchlistsResponse>;

  /**
   * Create a new watchlist for the authenticated user
   * @param params Parameters for creating a watchlist
   * @param options Optional request configuration
   * @returns A promise resolving to the created watchlist
   */
  createWatchlist(params: createWatchlistParameters, options?: RequestOptions): Promise<createWatchlistResponse>;

  /**
   * Get a specific watchlist by ID for the authenticated user
   * @param params Parameters including the watchlist ID
   * @param options Optional request configuration
   * @returns A promise resolving to the requested watchlist
   */
  getWatchlist(params: getWatchlistParameters, options?: RequestOptions): Promise<getWatchlistResponse>;

  /**
   * Update a specific watchlist by ID for the authenticated user
   * @param params Parameters for updating the watchlist
   * @param options Optional request configuration
   * @returns A promise resolving to the updated watchlist
   */
  updateWatchlist(params: updateWatchlistParameters, options?: RequestOptions): Promise<updateWatchlistResponse>;

  /**
   * Delete a specific watchlist by ID for the authenticated user
   * @param params Parameters including the watchlist ID
   * @param options Optional request configuration
   * @returns A promise resolving to the API response
   */
  deleteWatchlist(params: deleteWatchlistParameters, options?: RequestOptions): Promise<deleteWatchlistResponse>;

  /**
   * Modify the assets in a specific watchlist by ID for the authenticated user
   * @param params Parameters for modifying the watchlist assets
   * @param options Optional request configuration
   * @returns A promise resolving to the modified watchlist
   */
  modifyWatchlistAssets(params: modifyWatchlistAssetsParameters, options?: RequestOptions): Promise<modifyWatchlistAssetsResponse>;
}

/**
 * Interface for the Diligence API methods
 */
export interface DiligenceAPIInterface {
  /**
   * Gets a preview of the available diligence reports
   * @return The diligence reports
   */
  getDiligencePreview(): Promise<getPreviewsResponse>;

  /**
   * Gets a diligence report by asset ID
   * @param params The parameters for the diligence report
   * @return The diligence report
   */
  getDiligenceReport(params: getReportByAssetIDParameters): Promise<getReportByAssetIDResponse>;
}

/**
 * Interface for the Fundraising API methods
 */
export interface FundraisingAPIInterface {
  /**
   * Gets a list of all fundraising rounds based on provided filters
   * @param params Query parameters for filtering funding rounds
   */
  getFundingRounds(params?: getFundingRoundsParameters): Promise<APIResponseWithMetadata<FundingRound[]>>;

  /**
   * Gets a list of all investors for a given fundraising round
   * @param params Query parameters for filtering investors
   */
  getFundingRoundsInvestors(params?: getFundingRoundsInvestorsParameters): Promise<APIResponseWithMetadata<Investors[]>>;

  /**
   * Gets a list of all acquisition deals based on provided filters
   * @param params Query parameters for filtering acquisition deals
   */
  getAcquisitionDeals(params?: getAcquisitionDealsParameters): Promise<APIResponseWithMetadata<AcquisitionDeal[]>>;

  /**
   * Gets a list of all organizations based on provided filters
   * @param params Query parameters for filtering organizations
   */
  getOrganizations(params?: getOrganizationsParameters): Promise<APIResponseWithMetadata<Organization[]>>;

  /**
   * Gets a list of all projects based on provided filters
   * @param params Query parameters for filtering projects
   */
  getProjects(params?: getProjectsParameters): Promise<APIResponseWithMetadata<Project[]>>;
}

/**
 * Interface for the Token Unlocks API methods
 */
export interface TokenUnlocksInterface {
  getSupportedAssets(params?: getTokenUnlockSupportedAssetsParameters, options?: RequestOptions): Promise<getTokenUnlockSupportedAssetsResponse>;
  getAllocations(params?: getTokenUnlockAllocationsParameters, options?: RequestOptions): Promise<getTokenUnlockAllocationsResponse>;
  getVestingSchedule(params: getTokenUnlockVestingScheduleParameters, options?: RequestOptions): Promise<getTokenUnlockVestingScheduleResponse>;
  getUnlocks(params: getTokenUnlocksParameters, options?: RequestOptions): Promise<getTokenUnlocksResponse>;
  getEvents(params: getTokenUnlockEventsParameters, options?: RequestOptions): Promise<getTokenUnlockEventsResponse>;
}

/**
 * Abstract base class for the Messari client
 * Defines the structure and common functionality that all client implementations must provide
 */
export abstract class MessariClientBase {
  /**
   * Interface for AI-related API methods
   */
  public abstract readonly ai: AIInterface;

  /**
   * Interface for Asset-related API methods
   */
  public abstract readonly asset: AssetInterface;

  /**
   * Interface for Intel-related API methods
   */
  public abstract readonly intel: IntelInterface;

  /**
   * Interface for Fundraising-related API methods
   */
  public abstract readonly fundraising: FundraisingAPIInterface;

  /**
   * Interface for Token Unlocks-related API methods
   */
  public abstract readonly tokenUnlocks: TokenUnlocksInterface;

  /**
   * Interface for News-related API methods
   */
  public abstract readonly news: NewsInterface;

  /**
   * Interface for Research-related API methods
   */
  public abstract readonly research: ResearchInterface;

  /**
   * Interface for Diligence-related API methods
   */
  public abstract readonly diligence: DiligenceAPIInterface;

  /**
   * Interface for User Management-related API methods
   */
  public abstract readonly userManagement: UserManagementInterface;

  /**
   * Interface for Recaps-related API methods
   */
  // public abstract readonly recaps: RecapsAPIInterface;

  /**
   * Logger instance for the client
   */
  protected logger: Logger;

  /**
   * Flag indicating whether logging is disabled
   */
  protected isLoggingDisabled: boolean;

  /**
   * Event handlers for the client
   */
  protected abstract readonly eventHandlers: Map<ClientEventType, Set<ClientEventHandler<ClientEventType>>>;

  /**
   * Constructor for the MessariClientBase class
   * Initializes the logger and logging state
   */
  constructor() {
    this.isLoggingDisabled = false;
    this.logger = makeConsoleLogger("messari-client");
  }

  /**
   * Disable all logging from the client.
   * This will prevent any log messages from being output, regardless of their level.
   */
  public disableLogging(): void {
    this.isLoggingDisabled = true;
    this.logger = noOpLogger;
  }

  /**
   * Enable logging with the specified log level.
   * This will restore logging functionality if it was previously disabled.
   *
   * @param level The minimum log level to display (defaults to INFO)
   */
  public enableLogging(level: LogLevel = LogLevel.INFO): void {
    this.isLoggingDisabled = false;
    const baseLogger = makeConsoleLogger("messari-client");
    this.logger = createFilteredLogger(baseLogger, level);
  }

  /**
   * Set a custom logger for the client.
   * This allows you to integrate with your application's logging system.
   *
   * @param logger The logger implementation to use
   * @param level Optional minimum log level to filter messages
   */
  public setLogger(logger: Logger, level?: LogLevel): void {
    this.isLoggingDisabled = false;
    this.logger = level ? createFilteredLogger(logger, level) : logger;
  }

  /**
   * Check if logging is currently enabled for the client.
   *
   * @returns true if logging is enabled, false if it has been disabled
   */
  public isLoggingEnabled(): boolean {
    return !this.isLoggingDisabled;
  }

  /**
   * Execute an asynchronous function with logging temporarily disabled.
   * After the function completes, the previous logging state will be restored.
   *
   * @param fn The asynchronous function to execute with logging disabled
   * @returns A promise that resolves to the result of the function
   * @example
   * // Perform a sensitive operation without logging
   * const result = await client.withLoggingDisabled(async () => {
   *   return await client.ai.createChatCompletion({ ... });
   * });
   */
  public async withLoggingDisabled<T>(fn: () => Promise<T>): Promise<T> {
    const wasDisabled = this.isLoggingDisabled;
    try {
      // Disable logging if it was enabled
      if (!wasDisabled) {
        this.disableLogging();
      }
      // Execute the function
      return await fn();
    } finally {
      // Restore previous logging state if it was enabled
      if (!wasDisabled) {
        this.enableLogging();
      }
    }
  }

  /**
   * Execute a synchronous function with logging temporarily disabled.
   * After the function completes, the previous logging state will be restored.
   *
   * @param fn The synchronous function to execute with logging disabled
   * @returns The result of the function
   * @example
   * // Perform a sensitive operation without logging
   * const result = client.withLoggingDisabledSync(() => {
   *   return processPrivateData(data);
   * });
   */
  public withLoggingDisabledSync<T>(fn: () => T): T {
    const wasDisabled = this.isLoggingDisabled;
    try {
      // Disable logging if it was enabled
      if (!wasDisabled) {
        this.disableLogging();
      }
      // Execute the function
      return fn();
    } finally {
      // Restore previous logging state if it was enabled
      if (!wasDisabled) {
        this.enableLogging();
      }
    }
  }

  /**
   * Register an event handler
   * @param event The event type to listen for
   * @param handler The handler function to call when the event occurs
   */
  public on<T extends ClientEventType>(event: T, handler: ClientEventHandler<T>): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler as ClientEventHandler<ClientEventType>);
  }

  /**
   * Remove an event handler
   * @param event The event type to remove the handler from
   * @param handler The handler function to remove
   */
  public off<T extends ClientEventType>(event: T, handler: ClientEventHandler<T>): void {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event)?.delete(handler as ClientEventHandler<ClientEventType>);
    }
  }

  /**
   * Emit an event to all registered handlers
   * @param event The event type to emit
   * @param data The event data to pass to handlers
   */
  protected emit<T extends ClientEventType>(event: T, data: ClientEventMap[T]): void {
    if (this.eventHandlers.has(event)) {
      for (const handler of this.eventHandlers.get(event) || []) {
        try {
          handler(data);
        } catch (error) {
          this.logger(LogLevel.ERROR, `Error in ${event} handler`, { error });
        }
      }
    }
  }
}
