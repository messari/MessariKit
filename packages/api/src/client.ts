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
} from "@messari-kit/types";
import { pick } from "./utils";

export interface MessariClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface PaginationParameters {
  limit?: string;
  page?: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalRows: number;
  totalPages: number;
}

export type PaginatedResponse<T> = APIResponseWithMetadata<
  T,
  PaginationMetadata
>;

export interface PaginationHelpers<T, P extends PaginationParameters> {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => Promise<PaginatedResult<T, P>>;
  previousPage: () => Promise<PaginatedResult<T, P>>;
  goToPage: (page: number) => Promise<PaginatedResult<T, P>>;
  getAllPages: () => Promise<T[]>;
}

export type PaginatedResult<T, P extends PaginationParameters> = {
  data: T;
  metadata?: PaginationMetadata;
  error?: string;
} & PaginationHelpers<T, P>;

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
    queryParams?: Record<string, string>;
  }): Promise<APIResponseWithMetadata<T, M>> {
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
    return {
      data: responseData.data,
      metadata: responseData.metadata,
    };
  }

  private paginate<T, P extends PaginationParameters>(
    params: P,
    fetchFn: (
      params: P
    ) => Promise<APIResponseWithMetadata<T, PaginationMetadata>>,
    initialResponse: APIResponseWithMetadata<T, PaginationMetadata>
  ): PaginatedResult<T, P> {
    // This method adds pagination helpers to the response
    const createPaginationHelpers = (
      response: APIResponseWithMetadata<T, PaginationMetadata>
    ): PaginationHelpers<T, P> => {
      const metadata = response.metadata;
      const currentPage = metadata?.page || 1;
      const totalPages = metadata?.totalPages || 1;

      const hasNextPage = currentPage < totalPages;
      const hasPreviousPage = currentPage > 1;

      const nextPage = async (): Promise<PaginatedResult<T, P>> => {
        if (!hasNextPage) {
          return {
            data: response.data,
            metadata: response.metadata,
            error: response.error,
            ...createPaginationHelpers(response),
          };
        }
        const nextPageParams = {
          ...params,
          page: (currentPage + 1).toString(),
        };
        const nextPageResponse = await fetchFn(nextPageParams as P);
        return {
          data: nextPageResponse.data,
          metadata: nextPageResponse.metadata,
          error: nextPageResponse.error,
          ...createPaginationHelpers(nextPageResponse),
        };
      };

      const previousPage = async (): Promise<PaginatedResult<T, P>> => {
        if (!hasPreviousPage) {
          return {
            data: response.data,
            metadata: response.metadata,
            error: response.error,
            ...createPaginationHelpers(response),
          };
        }
        const prevPageParams = {
          ...params,
          page: (currentPage - 1).toString(),
        };
        const prevPageResponse = await fetchFn(prevPageParams as P);
        return {
          data: prevPageResponse.data,
          metadata: prevPageResponse.metadata,
          error: prevPageResponse.error,
          ...createPaginationHelpers(prevPageResponse),
        };
      };

      const goToPage = async (page: number): Promise<PaginatedResult<T, P>> => {
        if (page < 1 || page > totalPages) {
          throw new Error(`Page ${page} is out of range (1-${totalPages})`);
        }
        const pageParams = {
          ...params,
          page: page.toString(),
        };
        const pageResponse = await fetchFn(pageParams as P);
        return {
          data: pageResponse.data,
          metadata: pageResponse.metadata,
          error: pageResponse.error,
          ...createPaginationHelpers(pageResponse),
        };
      };

      const getAllPages = async (): Promise<T[]> => {
        if (!metadata) {
          return [response.data];
        }

        const allData: T[] = [response.data];
        let currentPageNum = currentPage;

        while (currentPageNum < totalPages) {
          currentPageNum++;
          const pageParams = {
            ...params,
            page: currentPageNum.toString(),
          };
          const pageResponse = await fetchFn(pageParams as P);
          allData.push(pageResponse.data);
        }

        return allData;
      };

      return {
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
        goToPage,
        getAllPages,
      };
    };

    return {
      data: initialResponse.data,
      metadata: initialResponse.metadata,
      error: initialResponse.error,
      ...createPaginationHelpers(initialResponse),
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
