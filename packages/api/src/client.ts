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
} from "@messari-kit/types";
import { pick } from "./utils";

export interface MessariClientOptions {
  apiKey: string;
  baseUrl?: string;
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

    const data = await response.json();
    return data.data;
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
    getNewsFeed: (params: getNewsFeedParameters) =>
      this.request<getNewsFeedResponse>({
        method: getNewsFeed.method,
        path: getNewsFeed.path(),
        queryParams: pick(params, getNewsFeed.queryParams),
      }),
    getNewsFeedAssets: (params: getNewsFeedAssetsParameters) =>
      this.request<getNewsFeedAssetsResponse>({
        method: getNewsFeedAssets.method,
        path: getNewsFeedAssets.path(),
        queryParams: pick(params, getNewsFeedAssets.queryParams),
      }),
    getNewsSources: (params: getNewsSourcesParameters) =>
      this.request<getNewsSourcesResponse>({
        method: getNewsSources.method,
        path: getNewsSources.path(),
        queryParams: pick(params, getNewsSources.queryParams),
      }),
  };
}
