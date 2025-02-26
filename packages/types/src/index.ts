import { components } from './types';


// Define APIResponseWithMetadata as a generic type
export interface APIResponseWithMetadata<T = unknown, M = unknown> {
  /** @description Response payload */
  data: T;
  /** @description Error message if request failed */
  error?: string;
  /** @description Additional metadata about the response */
  metadata?: M;
}

// Define PathParams type for path functions
export type PathParams = Record<string, string>;




export type createChatCompletionResponse = components['schemas']['ChatCompletionResponse'];
export type createChatCompletionError = components['schemas']['APIError'];

export type createChatCompletionParameters = components['schemas']['ChatCompletionRequest'];


export const createChatCompletion = {
  method: 'POST' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: ['messages', 'verbosity', 'response_format', 'stream'] as const,
  path: () => '/ai/v1/chat/completions'
} as const;


export type extractEntitiesResponse = components['schemas']['ExtractResponse'];
export type extractEntitiesError = components['schemas']['APIError'];

export type extractEntitiesParameters = components['schemas']['ExtractRequest'];


export const extractEntities = {
  method: 'POST' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: ['content', 'entityTypes', 'allSimilarEntities'] as const,
  path: () => '/ai/v1/classification/extraction'
} as const;


export type getAllEventsResponse = APIResponseWithMetadata<components['schemas']['Event'][], components['schemas']['PaginationResult']>;
export type getAllEventsError = components['schemas']['APIError'];

export type getAllEventsParameters = components['schemas']['GetAllEventsRequest'];


export const getAllEvents = {
  method: 'POST' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: ['page', 'limit', 'primaryAssets', 'secondaryAssets', 'primaryOrSecondaryAssets', 'startTime', 'endTime', 'importance', 'category', 'subcategory', 'tag', 'status', 'globalEvent'] as const,
  path: () => '/intel/v1/events'
} as const;


export type getEventAndHistoryResponse = components['schemas']['GetEventResponse'];
export type getEventAndHistoryError = components['schemas']['APIError'];

export type getEventAndHistoryParameters = { eventId: string };


export const getEventAndHistory = {
  method: 'GET' as const,
  pathParams: ['eventId'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/intel/v1/events/${p.eventId}`
} as const;


export type getAllAssetsResponse = APIResponseWithMetadata<components['schemas']['Asset'][], components['schemas']['PaginationResult']>;
export type getAllAssetsError = components['schemas']['APIError'];

export type getAllAssetsParameters = { page?: number; limit?: number; symbol?: string; name?: string };


export const getAllAssets = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['page', 'limit', 'symbol', 'name'] as const,
  bodyParams: [] as const,
  path: () => '/intel/v1/assets'
} as const;


export type getNewsFeedAssetsResponse = APIResponseWithMetadata<components['schemas']['AssetList'], components['schemas']['PaginationResult']>;
export type getNewsFeedAssetsError = components['schemas']['APIError'];

export type getNewsFeedAssetsParameters = { nameOrSymbol?: string; limit?: number; page?: number };


export const getNewsFeedAssets = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['nameOrSymbol', 'limit', 'page'] as const,
  bodyParams: [] as const,
  path: () => '/news/v1/news/assets'
} as const;


export type getNewsFeedResponse = APIResponseWithMetadata<components['schemas']['DocumentList'], components['schemas']['PaginationResult']>;
export type getNewsFeedError = components['schemas']['APIError'];

export type getNewsFeedParameters = { publishedBefore?: number; publishedAfter?: number; sourceTypes?: string[]; sourceIds?: string[]; assetIds?: string[]; sort?: number; limit?: number; page?: number };


export const getNewsFeed = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['publishedBefore', 'publishedAfter', 'sourceTypes', 'sourceIds', 'assetIds', 'sort', 'limit', 'page'] as const,
  bodyParams: [] as const,
  path: () => '/news/v1/news/feed'
} as const;


export type getNewsSourcesResponse = APIResponseWithMetadata<components['schemas']['SourceList'], components['schemas']['PaginationResult']>;
export type getNewsSourcesError = components['schemas']['APIError'];

export type getNewsSourcesParameters = { sourceName?: string; limit?: number; page?: number };


export const getNewsSources = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['sourceName', 'limit', 'page'] as const,
  bodyParams: [] as const,
  path: () => '/news/v1/news/sources'
} as const;


export type getAssetsROIResponse = components['schemas']['AssetWithROIData'][];
export type getAssetsROIError = components['schemas']['APIError'];

export type getAssetsROIParameters = null;


export const getAssetsROI = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/marketdata/v1/assets/roi'
} as const;


export type getAssetsATHResponse = components['schemas']['AssetWithATHData'][];
export type getAssetsATHError = components['schemas']['APIError'];

export type getAssetsATHParameters = null;


export const getAssetsATH = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/marketdata/v1/assets/ath'
} as const;


export type getAssetPriceResponse = components['schemas']['AssetMarketData'];
export type getAssetPriceError = components['schemas']['APIError'];

export type getAssetPriceParameters = { assetId: string };


export const getAssetPrice = {
  method: 'GET' as const,
  pathParams: ['assetId'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/marketdata/v1/assets/${p.assetId}/price`
} as const;


export type getAssetROIResponse = components['schemas']['AssetWithROIData'];
export type getAssetROIError = components['schemas']['APIError'];

export type getAssetROIParameters = { assetId: string };


export const getAssetROI = {
  method: 'GET' as const,
  pathParams: ['assetId'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/marketdata/v1/assets/${p.assetId}/roi`
} as const;


export type getAssetATHResponse = components['schemas']['AssetWithATHData'];
export type getAssetATHError = components['schemas']['APIError'];

export type getAssetATHParameters = { assetId: string };


export const getAssetATH = {
  method: 'GET' as const,
  pathParams: ['assetId'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/marketdata/v1/assets/${p.assetId}/ath`
} as const;

// Re-export schema types
export * from './schema';
