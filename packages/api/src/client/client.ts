import {
  createChatCompletion,
  extractEntities,
  getNewsFeed,
  getNewsSources,
  getNewsFeedAssets,
  getAllEvents,
  getEventAndHistory,
  getAllAssets,
  getPreviews,
  getReportByAssetID,
  getResearchReports,
  getResearchReportById,
  getResearchReportTags,
  getFundingRounds,
  getFundingRoundsInvestors,
  getAcquisitionDeals,
  getTokenUnlockAllocations,
  getTokenUnlockEvents,
  getTokenUnlockSupportedAssets,
  getTokenUnlocks,
  getTokenUnlockVestingSchedule,
  getOrganizations,
  getProjects,
  // V2 asset endpoints
  getAssetsV2,
  getAssetDetails,
  getAssetsTimeseriesCatalog,
  getAssetsV2ATH,
  getAssetsV2ROI,
  getAssetTimeseries,
  getAssetTimeseriesWithGranularity,
  getExchanges,
  getExchange,
  getExchangeMetrics,
  getExchangeTimeseries,
  getNetworkTimeseries,
  getNetworkMetrics,
  getMarketMetrics,
  getMarketTimeseries,
  getNetworks,
  getNetwork,
  getMarkets,
  getMarket,
} from "../types";
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
  APIResponseWithMetadata,
  getAllEventsParameters,
  getEventAndHistoryParameters,
  getEventAndHistoryResponse,
  getAllAssetsParameters,
  getAllAssetsResponse,
  getAllEventsResponse,
  getPreviewsResponse,
  getReportByAssetIDResponse,
  getReportByAssetIDParameters,
  getResearchReportsParameters,
  getResearchReportsResponse,
  getResearchReportByIdParameters,
  getResearchReportByIdResponse,
  getResearchReportTagsResponse,
  getFundingRoundsParameters,
  getFundingRoundsResponse,
  getFundingRoundsInvestorsParameters,
  getFundingRoundsInvestorsResponse,
  getAcquisitionDealsParameters,
  getAcquisitionDealsResponse,
  getTokenUnlockAllocationsParameters,
  getTokenUnlockAllocationsResponse,
  getTokenUnlockEventsParameters,
  getTokenUnlockEventsResponse,
  getTokenUnlockSupportedAssetsParameters,
  getTokenUnlockSupportedAssetsResponse,
  getTokenUnlocksParameters,
  getTokenUnlocksResponse,
  getTokenUnlockVestingScheduleParameters,
  getTokenUnlockVestingScheduleResponse,
  getOrganizationsParameters,
  getOrganizationsResponse,
  getProjectsParameters,
  getProjectsResponse,
  // V2 asset endpoints
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
  getExchangeResponse,
  getExchangeParameters,
  getExchangeTimeseriesResponse,
  getExchangeTimeseriesParameters,
  getExchangeMetricsResponse,
  getNetworkMetricsResponse,
  getNetworkTimeseriesParameters,
  getNetworkTimeseriesResponse,
  getMarketMetricsResponse,
  getMarketTimeseriesParameters,
  getMarketTimeseriesResponse,
  getNetworksResponse,
  getNetworksParameters,
  getNetworkResponse,
  getNetworkParameters,
  getMarketsParameters,
  getMarketsResponse,
  getMarketResponse,
  getMarketParameters,
} from "../types";
import type { Agent } from "node:http";
import { pick } from "../utils";
import { LogLevel, type Logger, makeConsoleLogger, createFilteredLogger, noOpLogger } from "../logging";
import { RequestTimeoutError } from "../error";
import type {
  ClientEventHandler,
  ClientEventType,
  MessariClientOptions,
  PaginatedResult,
  PaginationHelpers,
  PaginationMetadata,
  PaginationParameters,
  RequestOptions,
  RequestParameters,
} from "./types";
import type {
  AIInterface,
  AssetInterface,
  FundraisingAPIInterface,
  DiligenceAPIInterface,
  IntelInterface,
  NewsInterface,
  RecapsAPIInterface,
  ResearchInterface,
  TokenUnlocksInterface,
  ExchangesInterface,
  NetworksInterface,
  MarketsInterface,
} from "./base";
import { MessariClientBase } from "./base";

/**
 * MessariClient is the main client class for interacting with the Messari API.
 * It provides a comprehensive interface for accessing market data, news, intelligence,
 * and AI-powered features through typed methods and robust error handling.
 *
 * Key features:
 * - Full TypeScript support with strongly typed requests and responses
 * - Configurable logging and error handling
 * - Built-in request timeout and retry logic
 * - Pagination helpers for listing endpoints
 * - Event system for monitoring requests, responses and errors
 * - Connection pooling support via HTTP agent
 * - Custom fetch implementation support
 */
export class MessariClient extends MessariClientBase {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchFn: typeof fetch;
  private readonly agent?: Agent;
  private readonly defaultHeaders: Record<string, string>;

  protected readonly eventHandlers: Map<ClientEventType, Set<ClientEventHandler<ClientEventType>>>;

  protected logger: Logger;
  protected isLoggingDisabled: boolean;

  constructor(options: MessariClientOptions) {
    super();

    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://api.messari.io";
    this.timeoutMs = options.timeoutMs || 60_000; // 60 seconds
    this.fetchFn = options.fetch || fetch;
    this.agent = options.agent;

    // Handle logger initialization with disableLogging option
    this.isLoggingDisabled = !!options.disableLogging;
    if (this.isLoggingDisabled) {
      this.logger = noOpLogger;
    } else {
      const baseLogger = options.logger || makeConsoleLogger("messari-client");
      this.logger = createFilteredLogger(baseLogger, options.logLevel ?? LogLevel.INFO);
    }

    this.defaultHeaders = {
      "Content-Type": "application/json",
      "x-messari-api-key": this.apiKey,
      ...options.defaultHeaders,
    };

    // Initialize event handlers
    this.eventHandlers = new Map();

    // Register event handlers from options
    if (options.onError) {
      this.on("error", options.onError);
    }
    if (options.onRequest) {
      this.on("request", options.onRequest);
    }
    if (options.onResponse) {
      this.on("response", options.onResponse);
    }
  }

  private async request<T>({ method, path, body, queryParams = {}, options = {} }: RequestParameters): Promise<T> {
    this.logger(LogLevel.DEBUG, "request start", {
      method,
      url: `${this.baseUrl}${path}`,
      queryParams,
    });

    this.emit("request", {
      method,
      path,
      queryParams,
    });

    const queryString = Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`).join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
      })
      .join("&");

    const url = `${this.baseUrl}${path}${queryString ? `?${queryString}` : ""}`;

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const timeoutMs = options.timeoutMs || this.timeoutMs;

    try {
      const response = await RequestTimeoutError.rejectAfterTimeout(
        this.fetchFn(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: options.signal,
          cache: options.cache,
          credentials: options.credentials,
          integrity: options.integrity,
          keepalive: options.keepalive,
          mode: options.mode,
          redirect: options.redirect,
          referrer: options.referrer,
          referrerPolicy: options.referrerPolicy,
          // @ts-ignore - Next.js specific options
          next: options.next,
          // Node.js specific option
          agent: this.agent,
        }),
        timeoutMs,
      );

      if (!response.ok) {
        const errorData = await response.json();
        this.logger(LogLevel.ERROR, "request error", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        const error = new Error(errorData.error || "An error occurred");

        this.emit("error", {
          error,
          request: {
            method,
            path,
            queryParams,
          },
        });

        throw error;
      }

      const responseData = await response.json();
      this.logger(LogLevel.DEBUG, "request success", { responseData });

      // Emit response event
      this.emit("response", {
        method,
        path,
        status: response.status,
        data: responseData,
      });

      return responseData.data;
    } catch (error) {
      this.logger(LogLevel.ERROR, "request failed", { error });

      // Emit error event
      this.emit("error", {
        error: error as Error,
        request: {
          method,
          path,
          queryParams,
        },
      });

      throw error;
    }
  }

  private async requestWithMetadata<T, M>({ method, path, body, queryParams = {}, options = {} }: RequestParameters): Promise<APIResponseWithMetadata<T, M>> {
    this.logger(LogLevel.DEBUG, "request with metadata start", {
      method,
      url: `${this.baseUrl}${path}`,
      queryParams,
    });

    // Emit request event
    this.emit("request", {
      method,
      path,
      queryParams,
    });

    const queryString = Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        // Handle array values
        if (Array.isArray(value)) {
          return value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`).join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
      })
      .join("&");

    const url = `${this.baseUrl}${path}${queryString ? `?${queryString}` : ""}`;

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const timeoutMs = options.timeoutMs || this.timeoutMs;

    try {
      const response = await RequestTimeoutError.rejectAfterTimeout(
        this.fetchFn(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: options.signal,
          cache: options.cache,
          credentials: options.credentials,
          integrity: options.integrity,
          keepalive: options.keepalive,
          mode: options.mode,
          redirect: options.redirect,
          referrer: options.referrer,
          referrerPolicy: options.referrerPolicy,
          // @ts-ignore - Next.js specific options
          next: options.next,
          // Node.js specific option
          agent: this.agent,
        }),
        timeoutMs,
      );

      if (!response.ok) {
        const errorData = await response.json();
        this.logger(LogLevel.ERROR, "request with metadata error", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        const error = new Error(errorData.error || "An error occurred");

        // Emit error event
        this.emit("error", {
          error,
          request: {
            method,
            path,
            queryParams,
          },
        });

        throw error;
      }

      const responseData = await response.json();
      this.logger(LogLevel.DEBUG, "request with metadata success", {
        responseData,
      });

      // Emit response event
      this.emit("response", {
        method,
        path,
        status: response.status,
        data: responseData,
      });

      return {
        data: responseData.data,
        metadata: responseData.metadata,
      };
    } catch (error) {
      this.logger(LogLevel.ERROR, "request with metadata failed", { error });

      // Emit error event
      this.emit("error", {
        error: error as Error,
        request: {
          method,
          path,
          queryParams,
        },
      });

      throw error;
    }
  }

  private paginate<T, P extends PaginationParameters>(
    params: P,
    fetchPage: (params: P, options?: RequestOptions) => Promise<APIResponseWithMetadata<T, PaginationMetadata>>,
    response: APIResponseWithMetadata<T, PaginationMetadata>,
    options?: RequestOptions,
  ): PaginatedResult<T, P> {
    // Convert PaginationResult to PaginationMetadata
    const metadata: PaginationMetadata = response.metadata
      ? {
          page: response.metadata.page || 1,
          limit: response.metadata.limit || 10,
          total: response.metadata.total || 0,
          totalRows: response.metadata.total || 0,
          totalPages: Math.ceil((response.metadata.total || 0) / (response.metadata.limit || 10)),
          hasMore: response.metadata.hasMore || false,
        }
      : {
          page: 1,
          limit: 10,
          total: 0,
          totalRows: 0,
          totalPages: 0,
          hasMore: false,
        };

    const currentPage = metadata.page;
    const hasNextPage = metadata.hasMore || false || currentPage < (metadata.totalPages || 0);
    const hasPreviousPage = currentPage > 1;

    // This method adds pagination helpers to the response
    const createPaginationHelpers = (): PaginationHelpers<T, P> => {
      return {
        hasNextPage,
        hasPreviousPage,
        nextPage: async () => {
          if (!hasNextPage) {
            return {
              data: response.data,
              metadata,
              ...createPaginationHelpers(),
            };
          }

          const nextPage = currentPage + 1;
          const nextPageParams = {
            ...params,
            page: nextPage,
          };

          try {
            const nextPageResponse = await fetchPage(nextPageParams, options);
            const nextPageMetadata: PaginationMetadata = nextPageResponse.metadata
              ? {
                  page: nextPageResponse.metadata.page || nextPage,
                  limit: nextPageResponse.metadata.limit || metadata.limit,
                  totalRows: nextPageResponse.metadata.total || metadata.totalRows || 0,
                  totalPages: Math.ceil((nextPageResponse.metadata.total || metadata.totalRows || 0) / (nextPageResponse.metadata.limit || metadata.limit)),
                }
              : {
                  page: nextPage,
                  limit: metadata.limit,
                  totalRows: metadata.totalRows || 0,
                  totalPages: metadata.totalPages || 0,
                };

            return {
              data: nextPageResponse.data,
              metadata: nextPageMetadata,
              ...createPaginationHelpers(),
            };
          } catch (error) {
            throw new Error(`Error fetching next page: ${error}`);
          }
        },
        previousPage: async () => {
          if (!hasPreviousPage) {
            return {
              data: response.data,
              metadata,
              ...createPaginationHelpers(),
            };
          }

          const prevPage = currentPage - 1;
          const prevPageParams = {
            ...params,
            page: prevPage,
          };

          try {
            const prevPageResponse = await fetchPage(prevPageParams, options);
            const prevPageMetadata: PaginationMetadata = prevPageResponse.metadata
              ? {
                  page: prevPageResponse.metadata.page || prevPage,
                  limit: prevPageResponse.metadata.limit || metadata.limit,
                  totalRows: prevPageResponse.metadata.total || metadata.totalRows || 0,
                  totalPages: Math.ceil((prevPageResponse.metadata.total || metadata.totalRows || 0) / (prevPageResponse.metadata.limit || metadata.limit)),
                }
              : {
                  page: prevPage,
                  limit: metadata.limit,
                  totalRows: metadata.totalRows || 0,
                  totalPages: metadata.totalPages || 0,
                };

            return {
              data: prevPageResponse.data,
              metadata: prevPageMetadata,
              ...createPaginationHelpers(),
            };
          } catch (error) {
            throw new Error(`Error fetching previous page: ${error}`);
          }
        },
        goToPage: async (page: number) => {
          if (page < 1 || (metadata.totalPages && page > metadata.totalPages)) {
            throw new Error(`Page ${page} is out of range. Valid range: 1-${metadata.totalPages || "?"}`);
          }

          const pageParams = {
            ...params,
            page,
          };

          try {
            const pageResponse = await fetchPage(pageParams, options);
            const pageMetadata: PaginationMetadata = pageResponse.metadata
              ? {
                  page: pageResponse.metadata.page || page,
                  limit: pageResponse.metadata.limit || metadata.limit,
                  totalRows: pageResponse.metadata.total || metadata.totalRows || 0,
                  totalPages: Math.ceil((pageResponse.metadata.total || metadata.totalRows || 0) / (pageResponse.metadata.limit || metadata.limit)),
                }
              : {
                  page,
                  limit: metadata.limit,
                  totalRows: metadata.totalRows || 0,
                  totalPages: metadata.totalPages || 0,
                };

            return {
              data: pageResponse.data,
              metadata: pageMetadata,
              ...createPaginationHelpers(),
            };
          } catch (error) {
            throw new Error(`Error fetching page ${page}: ${error}`);
          }
        },
        getAllPages: async () => {
          if (!metadata.totalPages) {
            // If we don't know the total pages, just return the current page data
            return Array.isArray(response.data) ? response.data : [response.data];
          }

          const allPages: T[] = [];
          const totalPages = metadata.totalPages || 1;

          // Add current page data
          if (Array.isArray(response.data)) {
            allPages.push(...response.data);
          } else {
            allPages.push(response.data);
          }

          // Fetch all other pages
          const pagePromises: Promise<T[]>[] = [];
          for (let page = 1; page <= totalPages; page++) {
            if (page === currentPage) continue; // Skip current page

            const goToPageFn = this.paginate(params, fetchPage, response, options).goToPage;
            pagePromises.push(
              goToPageFn(page)
                .then((pageResponse: PaginatedResult<T, P>) => {
                  if (Array.isArray(pageResponse.data)) {
                    return pageResponse.data;
                  }
                  return [pageResponse.data];
                })
                .catch(() => []), // Return empty array on error
            );
          }

          const pageResults = await Promise.all(pagePromises);
          for (const pageData of pageResults) {
            allPages.push(...pageData);
          }

          return allPages;
        },
      };
    };

    return {
      data: response.data,
      metadata,
      error: response.error,
      ...createPaginationHelpers(),
    };
  }

  public readonly ai: AIInterface = {
    createChatCompletion: (params: createChatCompletionParameters, options?: RequestOptions) =>
      this.request<createChatCompletionResponse>({
        method: createChatCompletion.method,
        path: createChatCompletion.path(),
        body: pick(params, createChatCompletion.bodyParams),
        options,
      }),
    extractEntities: (params: extractEntitiesParameters, options?: RequestOptions) =>
      this.request<extractEntitiesResponse>({
        method: extractEntities.method,
        path: extractEntities.path(),
        body: pick(params, extractEntities.bodyParams),
        options,
      }),
  };

  public readonly asset: AssetInterface = {
    getAssetsV2: async (params: getAssetsV2Parameters = {}, options?: RequestOptions) => {
      return this.requestWithMetadata<getAssetsV2Response, PaginationMetadata>({
        method: getAssetsV2.method,
        path: getAssetsV2.path(),
        queryParams: pick(params, getAssetsV2.queryParams),
        options,
      });
    },

    getAssetDetails: async (params: getAssetDetailsParameters, options?: RequestOptions) => {
      return this.requestWithMetadata<getAssetDetailsResponse, PaginationMetadata>({
        method: getAssetDetails.method,
        path: getAssetDetails.path(),
        queryParams: pick(params, getAssetDetails.queryParams),
        options,
      });
    },

    getAssetsTimeseriesCatalog: async (options?: RequestOptions) => {
      return this.requestWithMetadata<getAssetsTimeseriesCatalogResponse, PaginationMetadata>({
        method: getAssetsTimeseriesCatalog.method,
        path: getAssetsTimeseriesCatalog.path(),
        options,
      });
    },

    getAssetsV2ATH: async (params: getAssetsV2ATHParameters = {}, options?: RequestOptions) => {
      return this.requestWithMetadata<getAssetsV2ATHResponse, PaginationMetadata>({
        method: getAssetsV2ATH.method,
        path: getAssetsV2ATH.path(),
        queryParams: pick(params, getAssetsV2ATH.queryParams),
        options,
      });
    },

    getAssetsV2ROI: async (params: getAssetsV2ROIParameters = {}, options?: RequestOptions) => {
      return this.requestWithMetadata<getAssetsV2ROIResponse, PaginationMetadata>({
        method: getAssetsV2ROI.method,
        path: getAssetsV2ROI.path(),
        queryParams: pick(params, getAssetsV2ROI.queryParams),
        options,
      });
    },

    getAssetTimeseries: async (params: getAssetTimeseriesParameters, options?: RequestOptions) => {
      return this.requestWithMetadata<getAssetTimeseriesResponse, TimeseriesMetadata>({
        method: getAssetTimeseries.method,
        path: getAssetTimeseries.path(params),
        queryParams: pick(params, getAssetTimeseries.queryParams),
        options,
      });
    },

    getAssetTimeseriesWithGranularity: async (params: getAssetTimeseriesWithGranularityParameters, options?: RequestOptions) => {
      return this.requestWithMetadata<getAssetTimeseriesWithGranularityResponse, TimeseriesMetadata>({
        method: getAssetTimeseriesWithGranularity.method,
        path: getAssetTimeseriesWithGranularity.path(params),
        queryParams: pick(params, getAssetTimeseriesWithGranularity.queryParams),
        options,
      });
    },
  };

  public readonly exchanges: ExchangesInterface = {
    getExchanges: async (params: getExchangesParameters = {}, options?: RequestOptions) => {
      return this.requestWithMetadata<getExchangesResponse, PaginationMetadata>({
        method: getExchanges.method,
        path: getExchanges.path(),
        queryParams: pick(params, getExchanges.queryParams),
        options,
      });
    },

    getExchangeById: async (params: getExchangeParameters, options?: RequestOptions) => {
      return this.requestWithMetadata<getExchangeResponse, PaginationMetadata>({
        method: getExchange.method,
        path: getExchange.path(params),
        options,
      });
    },

    getExchangeMetrics: async (options?: RequestOptions) => {
      return this.requestWithMetadata<getExchangeMetricsResponse, PaginationMetadata>({
        method: getExchangeMetrics.method,
        path: getExchangeMetrics.path(),
        options,
      });
    },

    getExchangeTimeseries: async (params: getExchangeTimeseriesParameters, options?: RequestOptions) => {
      return this.requestWithMetadata<getExchangeTimeseriesResponse, TimeseriesMetadata>({
        method: getExchangeTimeseries.method,
        path: getExchangeTimeseries.path(params),
        queryParams: pick(params, getExchangeTimeseries.queryParams),
        options,
      });
    },
  };

  public readonly networks: NetworksInterface = {
    getNetworks: async (params: getNetworksParameters = {}, options?: RequestOptions) => {
      return this.requestWithMetadata<getNetworksResponse, PaginationMetadata>({
        method: getNetworks.method,
        path: getNetworks.path(),
        queryParams: pick(params, getNetworks.queryParams),
        options,
      });
    },

    getNetworkById: async (params: getNetworkParameters, options?: RequestOptions) => {
      return this.requestWithMetadata<getNetworkResponse, PaginationMetadata>({
        method: getNetwork.method,
        path: getNetwork.path(params),
        options,
      });
    },

    getNetworkMetrics: async (options?: RequestOptions) => {
      return this.requestWithMetadata<getNetworkMetricsResponse, PaginationMetadata>({
        method: getNetworkMetrics.method,
        path: getNetworkMetrics.path(),
        options,
      });
    },

    getNetworkTimeseries: async (params: getNetworkTimeseriesParameters, options?: RequestOptions) => {
      return this.requestWithMetadata<getNetworkTimeseriesResponse, TimeseriesMetadata>({
        method: getNetworkTimeseries.method,
        path: getNetworkTimeseries.path(params),
        queryParams: pick(params, getNetworkTimeseries.queryParams),
        options,
      });
    },
  };

  public readonly markets: MarketsInterface = {
    getMarkets: async (params: getMarketsParameters = {}, options?: RequestOptions) => {
      return this.requestWithMetadata<getMarketsResponse, PaginationMetadata>({
        method: getMarkets.method,
        path: getMarkets.path(),
        queryParams: pick(params, getMarkets.queryParams),
        options,
      });
    },

    getMarketById: async (params: getMarketParameters, options?: RequestOptions) => {
      return this.requestWithMetadata<getMarketResponse, PaginationMetadata>({
        method: getMarket.method,
        path: getMarket.path(params),
        options,
      });
    },

    getMarketMetrics: async (options?: RequestOptions) => {
      return this.requestWithMetadata<getMarketMetricsResponse, PaginationMetadata>({
        method: getMarketMetrics.method,
        path: getMarketMetrics.path(),
        options,
      });
    },

    getMarketTimeseries: async (params: getMarketTimeseriesParameters, options?: RequestOptions) => {
      return this.requestWithMetadata<getMarketTimeseriesResponse, TimeseriesMetadata>({
        method: getMarketTimeseries.method,
        path: getMarketTimeseries.path(params),
        queryParams: pick(params, getMarketTimeseries.queryParams),
        options,
      });
    },
  };

  /**
   * @deprecated Intel is Work-in-Progress and not production ready
   */
  public readonly intel: IntelInterface = {
    getAllEvents: async (params: getAllEventsParameters = {}, options?: RequestOptions) => {
      const fetchPage = async (p: getAllEventsParameters, o?: RequestOptions) => {
        return this.requestWithMetadata<getAllEventsResponse["data"], PaginationMetadata>({
          method: getAllEvents.method,
          path: getAllEvents.path(),
          body: pick(p, getAllEvents.bodyParams),
          options: o,
        });
      };

      const response = await fetchPage(params, options);
      return this.paginate<getAllEventsResponse["data"], getAllEventsParameters>(params, fetchPage, response, options);
    },
    getById: async (params: getEventAndHistoryParameters, options?: RequestOptions) => {
      return this.request<getEventAndHistoryResponse>({
        method: getEventAndHistory.method,
        path: getEventAndHistory.path(params),
        options,
      });
    },
    getAllAssets: async (params: getAllAssetsParameters = {}, options?: RequestOptions) => {
      const fetchPage = async (p: getAllAssetsParameters, o?: RequestOptions) => {
        return this.requestWithMetadata<getAllAssetsResponse["data"], PaginationMetadata>({
          method: getAllAssets.method,
          path: getAllAssets.path(),
          queryParams: pick(p, getAllAssets.queryParams),
          options: o,
        });
      };

      const response = await fetchPage(params, options);
      return this.paginate<getAllAssetsResponse["data"], getAllAssetsParameters>(params, fetchPage, response, options);
    },
  };

  /**
   * @deprecated Fundraising is Work-in-Progress and not production ready
   */
  public readonly fundraising: FundraisingAPIInterface = {
    getFundingRounds: async (params: getFundingRoundsParameters) => {
      return this.requestWithMetadata<getFundingRoundsResponse, PaginationMetadata>({
        method: getFundingRounds.method,
        path: getFundingRounds.path(),
        queryParams: pick(params, getFundingRounds.queryParams),
      });
    },

    getFundingRoundsInvestors: async (params: getFundingRoundsInvestorsParameters) => {
      return this.requestWithMetadata<getFundingRoundsInvestorsResponse, PaginationMetadata>({
        method: getFundingRoundsInvestors.method,
        path: getFundingRoundsInvestors.path(),
        queryParams: pick(params, getFundingRoundsInvestors.queryParams),
      });
    },

    getAcquisitionDeals: async (params: getAcquisitionDealsParameters) => {
      return this.requestWithMetadata<getAcquisitionDealsResponse, PaginationMetadata>({
        method: getAcquisitionDeals.method,
        path: getAcquisitionDeals.path(),
        queryParams: pick(params, getAcquisitionDeals.queryParams),
      });
    },

    getOrganizations: async (params: getOrganizationsParameters) => {
      return this.requestWithMetadata<getOrganizationsResponse, PaginationMetadata>({
        method: getOrganizations.method,
        path: getOrganizations.path(),
        queryParams: pick(params, getOrganizations.queryParams),
      });
    },

    getProjects: async (params: getProjectsParameters) => {
      return this.requestWithMetadata<getProjectsResponse, PaginationMetadata>({
        method: getProjects.method,
        path: getProjects.path(),
        queryParams: pick(params, getProjects.queryParams),
      });
    },
  };

  /**
   * @deprecated TokenUnlocks is Work-in-Progress and not production ready
   */
  public readonly tokenUnlocks: TokenUnlocksInterface = {
    getSupportedAssets: async (params: getTokenUnlockSupportedAssetsParameters = {}, options?: RequestOptions) => {
      return this.request<getTokenUnlockSupportedAssetsResponse>({
        method: getTokenUnlockSupportedAssets.method,
        path: getTokenUnlockSupportedAssets.path(),
        queryParams: pick(params, getTokenUnlockSupportedAssets.queryParams),
        options,
      });
    },

    getAllocations: async (params: getTokenUnlockAllocationsParameters = {}, options?: RequestOptions) => {
      return this.request<getTokenUnlockAllocationsResponse>({
        method: getTokenUnlockAllocations.method,
        path: getTokenUnlockAllocations.path(),
        queryParams: pick(params, getTokenUnlockAllocations.queryParams),
        options,
      });
    },

    getVestingSchedule: async (params: getTokenUnlockVestingScheduleParameters, options?: RequestOptions) => {
      return this.request<getTokenUnlockVestingScheduleResponse>({
        method: getTokenUnlockVestingSchedule.method,
        path: getTokenUnlockVestingSchedule.path(params),
        queryParams: pick(params, getTokenUnlockVestingSchedule.queryParams),
        options,
      });
    },

    getUnlocks: async (params: getTokenUnlocksParameters, options?: RequestOptions) => {
      return this.request<getTokenUnlocksResponse>({
        method: getTokenUnlocks.method,
        path: getTokenUnlocks.path(params),
        queryParams: pick(params, getTokenUnlocks.queryParams),
        options,
      });
    },

    getEvents: async (params: getTokenUnlockEventsParameters, options?: RequestOptions) => {
      return this.request<getTokenUnlockEventsResponse>({
        method: getTokenUnlockEvents.method,
        path: getTokenUnlockEvents.path(params),
        queryParams: pick(params, getTokenUnlockEvents.queryParams),
        options,
      });
    },
  };

  /**
   * @deprecated News is Work-in-Progress and not production ready
   */
  public readonly news: NewsInterface = {
    getNewsFeedPaginated: async (params: getNewsFeedParameters, options?: RequestOptions) => {
      const fetchPage = async (p: getNewsFeedParameters, o?: RequestOptions) => {
        return this.requestWithMetadata<getNewsFeedResponse["data"], PaginationMetadata>({
          method: getNewsFeed.method,
          path: getNewsFeed.path(),
          queryParams: pick(p, getNewsFeed.queryParams),
          options: o,
        });
      };

      const initialResponse = await fetchPage(params, options);
      return this.paginate<getNewsFeedResponse["data"], getNewsFeedParameters>(params, fetchPage, initialResponse, options);
    },

    getNewsFeedAssetsPaginated: async (params: getNewsFeedAssetsParameters, options?: RequestOptions) => {
      const fetchPage = async (p: getNewsFeedAssetsParameters, o?: RequestOptions) => {
        return this.requestWithMetadata<getNewsFeedAssetsResponse["data"], PaginationMetadata>({
          method: getNewsFeedAssets.method,
          path: getNewsFeedAssets.path(),
          queryParams: pick(p, getNewsFeedAssets.queryParams),
          options: o,
        });
      };

      const initialResponse = await fetchPage(params, options);
      return this.paginate<getNewsFeedAssetsResponse["data"], getNewsFeedAssetsParameters>(params, fetchPage, initialResponse, options);
    },

    getNewsSourcesPaginated: async (params: getNewsSourcesParameters, options?: RequestOptions) => {
      const fetchPage = async (p: getNewsSourcesParameters, o?: RequestOptions) => {
        return this.requestWithMetadata<getNewsSourcesResponse["data"], PaginationMetadata>({
          method: getNewsSources.method,
          path: getNewsSources.path(),
          queryParams: pick(p, getNewsSources.queryParams),
          options: o,
        });
      };

      const initialResponse = await fetchPage(params, options);
      return this.paginate<getNewsSourcesResponse["data"], getNewsSourcesParameters>(params, fetchPage, initialResponse, options);
    },
  };

  /**
   * @deprecated Research is Work-in-Progress and not production ready
   */
  public readonly research: ResearchInterface = {
    getResearchReports: (params: getResearchReportsParameters, options?: RequestOptions) =>
      this.request<getResearchReportsResponse>({
        method: getResearchReports.method,
        path: getResearchReports.path(),
        queryParams: pick(params, getResearchReports.queryParams),
        options,
      }),
    getResearchReportById: (params: getResearchReportByIdParameters, options?: RequestOptions) =>
      this.request<getResearchReportByIdResponse>({
        method: getResearchReportById.method,
        path: getResearchReportById.path(params),
        options,
      }),
    getResearchReportTags: (options?: RequestOptions) =>
      this.request<getResearchReportTagsResponse>({
        method: getResearchReportTags.method,
        path: getResearchReportTags.path(),
        options,
      }),
  };

  /**
   * @deprecated Diligence is Work-in-Progress and not production ready
   */
  public readonly diligence: DiligenceAPIInterface = {
    getDiligencePreview: async () => {
      return this.request<getPreviewsResponse>({
        method: getPreviews.method,
        path: getPreviews.path(),
      });
    },
    getDiligenceReport: async (params: getReportByAssetIDParameters) => {
      return this.request<getReportByAssetIDResponse>({
        method: getReportByAssetID.method,
        path: getReportByAssetID.path(params),
      });
    },
  };

  // Recaps is commented out as we don't want to expose it yet
  // public readonly recaps: RecapsAPIInterface = {
  //   getProjectRecap: async (params: getProjectRecapParameters) => {
  //     return this.request<getProjectRecapResponse>({
  //       method: getProjectRecap.method,
  //       path: getProjectRecap.path(),
  //       queryParams: pick(params, getProjectRecap.queryParams),
  //     });
  //   },
  //   getExchangeRecap: async (params: getExchangeRecapParameters) => {
  //     return this.request<getExchangeRecapResponse>({
  //       method: getExchangeRecap.method,
  //       path: getExchangeRecap.path(),
  //       queryParams: pick(params, getExchangeRecap.queryParams),
  //     });
  //   },
  //   getExchangeRankingsRecap: async () => {
  //     return this.request<getExchangeRankingsRecapResponse>({
  //       method: getExchangeRankingsRecap.method,
  //       path: getExchangeRankingsRecap.path(),
  //     });
  //   },
  // };
}
