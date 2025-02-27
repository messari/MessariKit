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
  getAssetMarketdataParameters,
  getAssetMarketdataResponse,
  getAssetROIParameters,
  getAssetROIResponse,
  getAssetATHParameters,
  getAssetATHResponse,
  getAssetsROIResponse,
  getAssetsATHResponse,
  getProjectRecapParameters,
  getExchangeRankingsRecapResponse,
  getExchangeRecapParameters,
  getExchangeRecapResponse,
  getProjectRecapResponse,
} from "@messari-kit/types";
import type { LogLevel, Logger } from "../logging";
import type {
  PaginatedResult,
  PaginationMetadata,
  PaginationParameters,
  RequestOptions,
  ClientEventMap,
  ClientEventType,
} from "./types";

/**
 * Interface for the AI API methods
 */
export interface AIInterface {
  /**
   * Creates a chat completion using Messari's AI
   * @param params Parameters for the chat completion request
   * @param options Optional request configuration
   * @returns A promise resolving to the chat completion response
   */
  createChatCompletion(
    params: createChatCompletionParameters,
    options?: RequestOptions
  ): Promise<createChatCompletionResponse>;

  /**
   * Extracts entities from text content
   * @param params Parameters for entity extraction
   * @param options Optional request configuration
   * @returns A promise resolving to the extracted entities
   */
  extractEntities(
    params: extractEntitiesParameters,
    options?: RequestOptions
  ): Promise<extractEntitiesResponse>;
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
  getAllEvents(
    params?: getAllEventsParameters,
    options?: RequestOptions
  ): Promise<PaginatedResult<getAllEventsResponse["data"], getAllEventsParameters>>;

  /**
   * Gets a specific event by ID along with its history
   * @param params Parameters including the event ID
   * @param options Optional request configuration
   * @returns A promise resolving to the event and its history
   */
  getById(
    params: getEventAndHistoryParameters,
    options?: RequestOptions
  ): Promise<getEventAndHistoryResponse>;

  /**
   * Gets all assets with optional filtering
   * @param params Parameters for filtering assets
   * @param options Optional request configuration
   * @returns A paginated result of assets
   */
  getAllAssets(
    params?: getAllAssetsParameters,
    options?: RequestOptions
  ): Promise<PaginatedResult<getAllAssetsResponse["data"], getAllAssetsParameters>>;
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
  getNewsFeedPaginated(
    params: getNewsFeedParameters,
    options?: RequestOptions
  ): Promise<PaginatedResult<getNewsFeedResponse["data"], getNewsFeedParameters>>;

  /**
   * Gets assets mentioned in news with pagination
   * @param params Parameters for filtering assets in news
   * @param options Optional request configuration
   * @returns A paginated result of assets mentioned in news
   */
  getNewsFeedAssetsPaginated(
    params: getNewsFeedAssetsParameters,
    options?: RequestOptions
  ): Promise<PaginatedResult<getNewsFeedAssetsResponse["data"], getNewsFeedAssetsParameters>>;

  /**
   * Gets news sources with pagination
   * @param params Parameters for filtering news sources
   * @param options Optional request configuration
   * @returns A paginated result of news sources
   */
  getNewsSourcesPaginated(
    params: getNewsSourcesParameters,
    options?: RequestOptions
  ): Promise<PaginatedResult<getNewsSourcesResponse["data"], getNewsSourcesParameters>>;
}

/**
 * Interface for the Markets API methods
 */
export interface MarketsInterface {
  /**
   * Gets price data for a specific asset
   * @param params Parameters including the asset ID
   * @returns A promise resolving to the asset price data
   */
  getAssetPrice(params: getAssetMarketdataParameters): Promise<getAssetMarketdataResponse>;

  /**
   * Gets ROI data for a specific asset
   * @param params Parameters including the asset ID
   * @returns A promise resolving to the asset ROI data
   */
  getAssetROI(params: getAssetROIParameters): Promise<getAssetROIResponse>;

  /**
   * Gets all-time high data for a specific asset
   * @param params Parameters including the asset ID
   * @returns A promise resolving to the asset ATH data
   */
  getAssetATH(params: getAssetATHParameters): Promise<getAssetATHResponse>;

  /**
   * Gets ROI data for all assets
   * @returns A promise resolving to ROI data for all assets
   */
  getAllAssetsROI(): Promise<getAssetsROIResponse>;

  /**
   * Gets all-time high data for all assets
   * @returns A promise resolving to ATH data for all assets
   */
  getAllAssetsATH(): Promise<getAssetsATHResponse>;
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
 * Abstract base class for the Messari client
 * Defines the structure and common functionality that all client implementations must provide
 */
export abstract class MessariClientBase {
  /**
   * Interface for AI-related API methods
   */
  public abstract readonly ai: AIInterface;

  /**
   * Interface for Intel-related API methods
   */
  public abstract readonly intel: IntelInterface;

  /**
   * Interface for News-related API methods
   */
  public abstract readonly news: NewsInterface;

  /**
   * Interface for Markets-related API methods
   */
  public abstract readonly markets: MarketsInterface;

  /**
   * Disable all logging from the client
   */
  public abstract disableLogging(): void;

  /**
   * Enable logging with the specified log level
   * @param level The minimum log level to display
   */
  public abstract enableLogging(level?: LogLevel): void;

  /**
   * Set a custom logger for the client
   * @param logger The logger implementation to use
   * @param level Optional minimum log level to filter messages
   */
  public abstract setLogger(logger: Logger, level?: LogLevel): void;

  /**
   * Check if logging is currently enabled for the client
   * @returns true if logging is enabled, false if it has been disabled
   */
  public abstract isLoggingEnabled(): boolean;

  /**
   * Execute an asynchronous function with logging temporarily disabled
   * @param fn The asynchronous function to execute with logging disabled
   * @returns A promise that resolves to the result of the function
   */
  public abstract withLoggingDisabled<T>(fn: () => Promise<T>): Promise<T>;

  /**
   * Execute a synchronous function with logging temporarily disabled
   * @param fn The synchronous function to execute with logging disabled
   * @returns The result of the function
   */
  public abstract withLoggingDisabledSync<T>(fn: () => T): T;

  /**
   * Register an event handler
   * @param event The event type to listen for
   * @param handler The handler function to call when the event occurs
   */
  public abstract on<T extends ClientEventType>(
    event: T,
    handler: (data: ClientEventMap[T]) => void
  ): void;

  /**
   * Remove an event handler
   * @param event The event type to remove the handler from
   * @param handler The handler function to remove
   */
  public abstract off<T extends ClientEventType>(
    event: T,
    handler: (data: ClientEventMap[T]) => void
  ): void;
}
