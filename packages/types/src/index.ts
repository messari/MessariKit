// This file is auto-generated. DO NOT EDIT
import { components as aiComponents } from './ai';
import { components as newsComponents } from './news';

type components = aiComponents;


export type createChatCompletionResponse = aiComponents['schemas']['ChatCompletionResponse'];
export type createChatCompletionError = aiComponents['schemas']['APIError'];

export type createChatCompletionParameters = aiComponents['schemas']['ChatCompletionRequest'];


export const createChatCompletion = {
  method: 'POST' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: ['messages', 'verbosity', 'response_format', 'stream'] as const,
  path: () => '/ai/v1/chat/completions'
} as const;


export type extractEntitiesResponse = aiComponents['schemas']['ExtractResponse'];
export type extractEntitiesError = aiComponents['schemas']['APIError'];

export type extractEntitiesParameters = aiComponents['schemas']['ExtractRequest'];


export const extractEntities = {
  method: 'POST' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: ['content', 'entityTypes', 'allSimilarEntities'] as const,
  path: () => '/ai/v1/classification/extraction'
} as const;


export type getNewsFeedAssetsResponse = newsComponents['schemas']['AssetList'];
export type getNewsFeedAssetsError = newsComponents['schemas']['APIError'];

export type getNewsFeedAssetsParameters = { nameOrSymbol?: string; limit?: string; page?: string };


export const getNewsFeedAssets = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['nameOrSymbol', 'limit', 'page'] as const,
  bodyParams: [] as const,
  path: () => '/news/v1/news/assets'
} as const;


export type getNewsFeedResponse = newsComponents['schemas']['DocumentList'];
export type getNewsFeedError = newsComponents['schemas']['APIError'];

export type getNewsFeedParameters = { publishedBefore?: string; publishedAfter?: string; sourceTypes?: string; sourceIds?: string; assetIds?: string; sort?: string; limit?: string; page?: string };


export const getNewsFeed = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['publishedBefore', 'publishedAfter', 'sourceTypes', 'sourceIds', 'assetIds', 'sort', 'limit', 'page'] as const,
  bodyParams: [] as const,
  path: () => '/news/v1/news/feed'
} as const;


export type getNewsSourcesResponse = newsComponents['schemas']['SourceList'];
export type getNewsSourcesError = newsComponents['schemas']['APIError'];

export type getNewsSourcesParameters = { sourceName?: string; limit?: string; page?: string };


export const getNewsSources = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['sourceName', 'limit', 'page'] as const,
  bodyParams: [] as const,
  path: () => '/news/v1/news/sources'
} as const;
