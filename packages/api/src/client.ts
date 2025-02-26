import {
  createChatCompletion,
  createChatCompletionParameters,
  createChatCompletionResponse,
  extractEntities,
  extractEntitiesParameters,
  extractEntitiesResponse,
  getNewsFeed,
  getNewsFeedParameters,
  getNewsFeedResponse,
  getNewsSources,
  getNewsSourcesParameters,
  getNewsSourcesResponse,
  getNewsFeedAssets,
  getNewsFeedAssetsParameters,
  getNewsFeedAssetsResponse,
  APIResponseWithMetadata,
  getAllEvents,
  getAllEventsParameters,
  getEventAndHistory,
  getEventAndHistoryParameters,
  getEventAndHistoryResponse,
  getAllAssets,
  getAllAssetsParameters,
  getAllAssetsResponse,
  getAllEventsResponse,
  PathParams,
} from "@messari-kit/types";
import type { Agent } from "http";
import { pick } from "./utils";
import {
  LogLevel,
  Logger,
  makeConsoleLogger,
  createFilteredLogger,
} from "./logging";
import { RequestTimeoutError } from "./error";

// Event types for the client
export type ClientEventType = "error" | "request" | "response";

export interface ClientErrorEvent {
  error: Error;
  request?: {
    method: string;
    path: string;
    queryParams?: Record<string, any>;
  };
}

export interface ClientRequestEvent {
  method: string;
  path: string;
  queryParams?: Record<string, any>;
}

export interface ClientResponseEvent {
  method: string;
  path: string;
  status: number;
  data: any;
}

// Map event types to their corresponding event data types
export interface ClientEventMap {
  error: ClientErrorEvent;
  request: ClientRequestEvent;
  response: ClientResponseEvent;
}

export type ClientEventHandler<T extends ClientEventType> = (
  data: ClientEventMap[T]
) => void;

export interface MessariClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetch?: typeof fetch;
  agent?: Agent; // For Node.js http(s).Agent
  logLevel?: LogLevel;
  logger?: Logger;
  defaultHeaders?: Record<string, string>;
  onError?: ClientEventHandler<"error">;
  onRequest?: ClientEventHandler<"request">;
  onResponse?: ClientEventHandler<"response">;
}

export interface RequestOptions extends Omit<RequestInit, "headers" | "body"> {
  timeoutMs?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export interface RequestParameters {
  method: string;
  path: string;
  body?: any;
  queryParams?: Record<string, any>;
  options?: RequestOptions;
}

export interface PaginationParameters {
  limit?: number;
  page?: number;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total?: number;
  totalRows?: number;
  totalPages?: number;
  hasMore?: boolean;
}

export type PaginatedResponse<T> = APIResponseWithMetadata<
  T,
  PaginationMetadata
>;

export type PaginatedResult<T, P extends PaginationParameters> = {
  data: T;
  metadata?: PaginationMetadata;
  error?: string;
} & PaginationHelpers<T, P>;

export interface PaginationHelpers<T, P extends PaginationParameters> {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => Promise<PaginatedResult<T, P>>;
  previousPage: () => Promise<PaginatedResult<T, P>>;
  goToPage: (page: number) => Promise<PaginatedResult<T, P>>;
  getAllPages: () => Promise<T[]>;
}

export class MessariClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchFn: typeof fetch;
  private readonly agent: Agent | undefined;
  private readonly logger: Logger;
  private readonly defaultHeaders: Record<string, string>;
  private readonly eventHandlers: Map<
    ClientEventType,
    Set<ClientEventHandler<any>>
  >;

  constructor(options: MessariClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://api.messari.io";
    this.timeoutMs = options.timeoutMs || 60_000;
    this.fetchFn = options.fetch || fetch;
    this.agent = options.agent;

    const baseLogger = options.logger || makeConsoleLogger("messari-client");
    this.logger = options.logLevel
      ? createFilteredLogger(baseLogger, options.logLevel)
      : createFilteredLogger(baseLogger, LogLevel.INFO);

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

  /**
   * Register an event handler
   */
  public on<T extends ClientEventType>(
    event: T,
    handler: ClientEventHandler<T>
  ): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Remove an event handler
   */
  public off<T extends ClientEventType>(
    event: T,
    handler: ClientEventHandler<T>
  ): void {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event)!.delete(handler);
    }
  }

  /**
   * Emit an event to all registered handlers
   */
  private emit<T extends ClientEventType>(
    event: T,
    data: ClientEventMap[T]
  ): void {
    if (this.eventHandlers.has(event)) {
      for (const handler of this.eventHandlers.get(event)!) {
        try {
          handler(data);
        } catch (error) {
          this.logger(LogLevel.ERROR, `Error in ${event} handler`, { error });
        }
      }
    }
  }

  private async request<T>({
    method,
    path,
    body,
    queryParams = {},
    options = {},
  }: RequestParameters): Promise<T> {
    this.logger(LogLevel.INFO, "request start", { method, path });

    this.emit("request", {
      method,
      path,
      queryParams,
    });

    const queryString = Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map(
              (item) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`
            )
            .join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          String(value)
        )}`;
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
        timeoutMs
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

  private async requestWithMetadata<T, M>({
    method,
    path,
    body,
    queryParams = {},
    options = {},
  }: RequestParameters): Promise<APIResponseWithMetadata<T, M>> {
    this.logger(LogLevel.INFO, "request with metadata start", { method, path });

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
          return value
            .map(
              (item) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`
            )
            .join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          String(value)
        )}`;
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
        timeoutMs
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
    fetchPage: (
      params: P,
      options?: RequestOptions
    ) => Promise<APIResponseWithMetadata<T, PaginationMetadata>>,
    response: APIResponseWithMetadata<T, PaginationMetadata>,
    options?: RequestOptions
  ): PaginatedResult<T, P> {
    // Convert PaginationResult to PaginationMetadata
    const metadata: PaginationMetadata = response.metadata
      ? {
          page: response.metadata.page || 1,
          limit: response.metadata.limit || 10,
          total: response.metadata.total || 0,
          totalRows: response.metadata.total || 0,
          totalPages: Math.ceil(
            (response.metadata.total || 0) / (response.metadata.limit || 10)
          ),
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
    const hasNextPage =
      metadata.hasMore || false || currentPage < (metadata.totalPages || 0);
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
            const nextPageMetadata: PaginationMetadata =
              nextPageResponse.metadata
                ? {
                    page: nextPageResponse.metadata.page || nextPage,
                    limit: nextPageResponse.metadata.limit || metadata.limit,
                    totalRows:
                      nextPageResponse.metadata.total ||
                      metadata.totalRows ||
                      0,
                    totalPages: Math.ceil(
                      (nextPageResponse.metadata.total ||
                        metadata.totalRows ||
                        0) / (nextPageResponse.metadata.limit || metadata.limit)
                    ),
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
            throw error;
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
            const prevPageMetadata: PaginationMetadata =
              prevPageResponse.metadata
                ? {
                    page: prevPageResponse.metadata.page || prevPage,
                    limit: prevPageResponse.metadata.limit || metadata.limit,
                    totalRows:
                      prevPageResponse.metadata.total ||
                      metadata.totalRows ||
                      0,
                    totalPages: Math.ceil(
                      (prevPageResponse.metadata.total ||
                        metadata.totalRows ||
                        0) / (prevPageResponse.metadata.limit || metadata.limit)
                    ),
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
            throw error;
          }
        },
        goToPage: async (page: number) => {
          if (page < 1 || (metadata.totalPages && page > metadata.totalPages)) {
            throw new Error(
              `Page ${page} is out of range. Valid range: 1-${
                metadata.totalPages || "?"
              }`
            );
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
                  totalRows:
                    pageResponse.metadata.total || metadata.totalRows || 0,
                  totalPages: Math.ceil(
                    (pageResponse.metadata.total || metadata.totalRows || 0) /
                      (pageResponse.metadata.limit || metadata.limit)
                  ),
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
            throw error;
          }
        },
        getAllPages: async () => {
          if (!metadata.totalPages) {
            // If we don't know the total pages, just return the current page data
            return Array.isArray(response.data)
              ? response.data
              : [response.data];
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

            const goToPageFn = this.paginate(
              params,
              fetchPage,
              response,
              options
            ).goToPage;
            pagePromises.push(
              goToPageFn(page)
                .then((pageResponse: PaginatedResult<T, P>) => {
                  if (Array.isArray(pageResponse.data)) {
                    return pageResponse.data;
                  }
                  return [pageResponse.data];
                })
                .catch(() => []) // Return empty array on error
            );
          }

          const pageResults = await Promise.all(pagePromises);
          pageResults.forEach((pageData) => {
            allPages.push(...pageData);
          });

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

  public readonly ai = {
    createChatCompletion: (
      params: createChatCompletionParameters,
      options?: RequestOptions
    ) =>
      this.request<createChatCompletionResponse>({
        method: createChatCompletion.method,
        path: createChatCompletion.path(),
        body: pick(params, createChatCompletion.bodyParams),
        options,
      }),
    extractEntities: (
      params: extractEntitiesParameters,
      options?: RequestOptions
    ) =>
      this.request<extractEntitiesResponse>({
        method: extractEntities.method,
        path: extractEntities.path(),
        body: pick(params, extractEntities.bodyParams),
        options,
      }),
  };

  public readonly intel = {
    getAllEvents: async (
      params: getAllEventsParameters = {},
      options?: RequestOptions
    ) => {
      const fetchPage = async (
        p: getAllEventsParameters,
        o?: RequestOptions
      ) => {
        return this.requestWithMetadata<
          getAllEventsResponse["data"],
          PaginationMetadata
        >({
          method: getAllEvents.method,
          path: getAllEvents.path(),
          body: pick(p, getAllEvents.bodyParams),
          options: o,
        });
      };

      const response = await fetchPage(params, options);
      return this.paginate<
        getAllEventsResponse["data"],
        getAllEventsParameters
      >(params, fetchPage, response, options);
    },
    getById: async (
      params: getEventAndHistoryParameters,
      options?: RequestOptions
    ) => {
      return this.request<getEventAndHistoryResponse>({
        method: getEventAndHistory.method,
        path: getEventAndHistory.path(params),
        options,
      });
    },
    getAllAssets: async (
      params: getAllAssetsParameters = {},
      options?: RequestOptions
    ) => {
      const fetchPage = async (
        p: getAllAssetsParameters,
        o?: RequestOptions
      ) => {
        return this.requestWithMetadata<
          getAllAssetsResponse["data"],
          PaginationMetadata
        >({
          method: getAllAssets.method,
          path: getAllAssets.path(),
          queryParams: pick(p, getAllAssets.queryParams),
          options: o,
        });
      };

      const response = await fetchPage(params, options);
      return this.paginate<
        getAllAssetsResponse["data"],
        getAllAssetsParameters
      >(params, fetchPage, response, options);
    },
  };

  public readonly news = {
    // Paginated versions
    getNewsFeedPaginated: async (
      params: getNewsFeedParameters,
      options?: RequestOptions
    ) => {
      const fetchPage = async (
        p: getNewsFeedParameters,
        o?: RequestOptions
      ) => {
        return this.requestWithMetadata<
          getNewsFeedResponse["data"],
          PaginationMetadata
        >({
          method: getNewsFeed.method,
          path: getNewsFeed.path(),
          queryParams: pick(p, getNewsFeed.queryParams),
          options: o,
        });
      };

      const initialResponse = await fetchPage(params, options);
      return this.paginate<getNewsFeedResponse["data"], getNewsFeedParameters>(
        params,
        fetchPage,
        initialResponse,
        options
      );
    },

    getNewsFeedAssetsPaginated: async (
      params: getNewsFeedAssetsParameters,
      options?: RequestOptions
    ) => {
      const fetchPage = async (
        p: getNewsFeedAssetsParameters,
        o?: RequestOptions
      ) => {
        return this.requestWithMetadata<
          getNewsFeedAssetsResponse["data"],
          PaginationMetadata
        >({
          method: getNewsFeedAssets.method,
          path: getNewsFeedAssets.path(),
          queryParams: pick(p, getNewsFeedAssets.queryParams),
          options: o,
        });
      };

      const initialResponse = await fetchPage(params, options);
      return this.paginate<
        getNewsFeedAssetsResponse["data"],
        getNewsFeedAssetsParameters
      >(params, fetchPage, initialResponse, options);
    },

    getNewsSourcesPaginated: async (
      params: getNewsSourcesParameters,
      options?: RequestOptions
    ) => {
      const fetchPage = async (
        p: getNewsSourcesParameters,
        o?: RequestOptions
      ) => {
        return this.requestWithMetadata<
          getNewsSourcesResponse["data"],
          PaginationMetadata
        >({
          method: getNewsSources.method,
          path: getNewsSources.path(),
          queryParams: pick(p, getNewsSources.queryParams),
          options: o,
        });
      };

      const initialResponse = await fetchPage(params, options);
      return this.paginate<
        getNewsSourcesResponse["data"],
        getNewsSourcesParameters
      >(params, fetchPage, initialResponse, options);
    },
  };
}
