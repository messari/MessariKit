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
import { pick } from "./utils";

export interface MessariClientOptions {
  apiKey: string;
  baseUrl?: string;
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

  constructor(options: MessariClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://api.messari.io";
  }

  private async request<T>({
    method,
    path,
    body,
    queryParams = {},
  }: {
    method: string;
    path: string;
    body?: any;
    queryParams?: Record<string, string>;
  }): Promise<T> {
    const queryString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    const url = `${this.baseUrl}${path}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-messari-api-key": this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "An error occurred");
    }

    const responseData = await response.json();
    return responseData.data;
  }

  private async requestWithMetadata<T, M>({
    method,
    path,
    body,
    queryParams = {},
  }: {
    method: string;
    path: string;
    body?: any;
    queryParams?: Record<
      string,
      string | number | boolean | string[] | number[] | boolean[] | undefined
    >;
  }): Promise<APIResponseWithMetadata<T, M>> {
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

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-messari-api-key": this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "An error occurred");
    }

    const responseData = await response.json();
    return {
      data: responseData.data,
      metadata: responseData.metadata,
    };
  }

  private paginate<T, P extends PaginationParameters>(
    params: P,
    fetchPage: (
      params: P
    ) => Promise<APIResponseWithMetadata<T, PaginationMetadata>>,
    response: APIResponseWithMetadata<T, PaginationMetadata>
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
            const nextPageResponse = await fetchPage(nextPageParams);
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
            const prevPageResponse = await fetchPage(prevPageParams);
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
            const pageResponse = await fetchPage(pageParams);
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
              response
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
    createChatCompletion: (params: createChatCompletionParameters) =>
      this.request<createChatCompletionResponse>({
        method: createChatCompletion.method,
        path: createChatCompletion.path(),
        body: pick(params, createChatCompletion.bodyParams),
      }),
    extractEntities: (params: extractEntitiesParameters) =>
      this.request<extractEntitiesResponse>({
        method: extractEntities.method,
        path: extractEntities.path(),
        body: pick(params, extractEntities.bodyParams),
      }),
  };

  public readonly intel = {
    getAllEvents: async (params: getAllEventsParameters = {}) => {
      const fetchPage = async (p: getAllEventsParameters) => {
        return this.requestWithMetadata<
          getAllEventsResponse["data"],
          PaginationMetadata
        >({
          method: getAllEvents.method,
          path: getAllEvents.path(),
          body: pick(p, getAllEvents.bodyParams),
        });
      };

      const response = await fetchPage(params);
      return this.paginate<
        getAllEventsResponse["data"],
        getAllEventsParameters
      >(params, fetchPage, response);
    },
    getById: async (params: getEventAndHistoryParameters) => {
      return this.request<getEventAndHistoryResponse>({
        method: getEventAndHistory.method,
        path: getEventAndHistory.path(params),
      });
    },
    getAllAssets: async (params: getAllAssetsParameters = {}) => {
      const fetchPage = async (p: getAllAssetsParameters) => {
        return this.requestWithMetadata<
          getAllAssetsResponse["data"],
          PaginationMetadata
        >({
          method: getAllAssets.method,
          path: getAllAssets.path(),
          queryParams: pick(p, getAllAssets.queryParams),
        });
      };

      const response = await fetchPage(params);
      return this.paginate<
        getAllAssetsResponse["data"],
        getAllAssetsParameters
      >(params, fetchPage, response);
    },
  };

  public readonly news = {
    // Paginated versions
    getNewsFeedPaginated: async (params: getNewsFeedParameters) => {
      const fetchPage = async (p: getNewsFeedParameters) => {
        return this.requestWithMetadata<
          getNewsFeedResponse["data"],
          PaginationMetadata
        >({
          method: getNewsFeed.method,
          path: getNewsFeed.path(),
          queryParams: pick(p, getNewsFeed.queryParams),
        });
      };

      const initialResponse = await fetchPage(params);
      return this.paginate<getNewsFeedResponse["data"], getNewsFeedParameters>(
        params,
        fetchPage,
        initialResponse
      );
    },

    getNewsFeedAssetsPaginated: async (params: getNewsFeedAssetsParameters) => {
      const fetchPage = async (p: getNewsFeedAssetsParameters) => {
        return this.requestWithMetadata<
          getNewsFeedAssetsResponse["data"],
          PaginationMetadata
        >({
          method: getNewsFeedAssets.method,
          path: getNewsFeedAssets.path(),
          queryParams: pick(p, getNewsFeedAssets.queryParams),
        });
      };

      const initialResponse = await fetchPage(params);
      return this.paginate<
        getNewsFeedAssetsResponse["data"],
        getNewsFeedAssetsParameters
      >(params, fetchPage, initialResponse);
    },

    getNewsSourcesPaginated: async (params: getNewsSourcesParameters) => {
      const fetchPage = async (p: getNewsSourcesParameters) => {
        return this.requestWithMetadata<
          getNewsSourcesResponse["data"],
          PaginationMetadata
        >({
          method: getNewsSources.method,
          path: getNewsSources.path(),
          queryParams: pick(p, getNewsSources.queryParams),
        });
      };

      const initialResponse = await fetchPage(params);
      return this.paginate<
        getNewsSourcesResponse["data"],
        getNewsSourcesParameters
      >(params, fetchPage, initialResponse);
    },
  };
}
