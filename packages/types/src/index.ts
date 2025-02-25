// This file is auto-generated. DO NOT EDIT
import { components as aiComponents } from './ai';
import { components as intelComponents } from './intel';
import { components as newsComponents } from './news';

type components = aiComponents;
export type aiComponentsType = aiComponents;
export type intelComponentsType = intelComponents;
export type newsComponentsType = newsComponents;

// ai types
export type aiChatCompletionMessage = aiComponents['schemas']['ChatCompletionMessage'];
export type aiChatCompletionRequest = aiComponents['schemas']['ChatCompletionRequest'];
export type aiChatCompletionResponse = aiComponents['schemas']['ChatCompletionResponse'];
export type aiChatCompletionResponseMetadata = aiComponents['schemas']['ChatCompletionResponseMetadata'];
export type aiEntityType = aiComponents['schemas']['EntityType'];
export type aiExtractRequest = aiComponents['schemas']['ExtractRequest'];
export type aiEntity = aiComponents['schemas']['Entity'];
export type aiGroupedEntity = aiComponents['schemas']['GroupedEntity'];
export type aiExtractResponse = aiComponents['schemas']['ExtractResponse'];
export type aiExtractResponseMetadata = aiComponents['schemas']['ExtractResponseMetadata'];
export type aiAPIResponseWithMetadata = aiComponents['schemas']['APIResponseWithMetadata'];
export type aiAPIError = aiComponents['schemas']['APIError'];


// intel types
export type intelAsset = intelComponents['schemas']['Asset'];
export type intelResource = intelComponents['schemas']['Resource'];
export type intelEvent = intelComponents['schemas']['Event'];
export type intelEventHistory = intelComponents['schemas']['EventHistory'];
export type intelGetEventResponse = intelComponents['schemas']['GetEventResponse'];
export type intelGetAllEventsRequest = intelComponents['schemas']['GetAllEventsRequest'];
export type intelPaginationResult = intelComponents['schemas']['PaginationResult'];
export type intelAPIResponseWithMetadata = intelComponents['schemas']['APIResponseWithMetadata'];
export type intelAPIError = intelComponents['schemas']['APIError'];


// news types
export type newsSourceType = newsComponents['schemas']['SourceType'];
export type newsSource = newsComponents['schemas']['Source'];
export type newsSourceList = newsComponents['schemas']['SourceList'];
export type newsAsset = newsComponents['schemas']['Asset'];
export type newsAssetList = newsComponents['schemas']['AssetList'];
export type newsDocument = newsComponents['schemas']['Document'];
export type newsDocumentList = newsComponents['schemas']['DocumentList'];
export type newsPaginationResult = newsComponents['schemas']['PaginationResult'];
export type newsAPIResponseWithMetadata = newsComponents['schemas']['APIResponseWithMetadata'];
export type newsAPIError = newsComponents['schemas']['APIError'];


// Generic type for API responses with metadata
export interface APIResponseWithMetadata<T, M> {
  data: T;
  metadata?: M;
  error?: string;
}

// Define PathParams type for path parameter functions
export type PathParams = Record<string, string>;


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


export type getAllEventsResponse = APIResponseWithMetadata<intelComponents['schemas']['Event'][], intelComponents['schemas']['PaginationResult']>;
export type getAllEventsError = intelComponents['schemas']['APIError'];

export type getAllEventsParameters = intelComponents['schemas']['GetAllEventsRequest'];


export const getAllEvents = {
  method: 'POST' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: ['page', 'limit', 'primaryAssets', 'secondaryAssets', 'primaryOrSecondaryAssets', 'startTime', 'endTime', 'importance', 'category', 'subcategory', 'tag', 'status', 'globalEvent'] as const,
  path: () => '/intel/v1/events'
} as const;


export type getEventAndHistoryResponse = intelComponents['schemas']['GetEventResponse'];
export type getEventAndHistoryError = intelComponents['schemas']['APIError'];

export type getEventAndHistoryParameters = { eventId: string };


export const getEventAndHistory = {
  method: 'GET' as const,
  pathParams: ['eventId'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/intel/v1/events/${p.eventId}`
} as const;


export type getAllAssetsResponse = APIResponseWithMetadata<intelComponents['schemas']['Asset'][], intelComponents['schemas']['PaginationResult']>;
export type getAllAssetsError = intelComponents['schemas']['APIError'];

export type getAllAssetsParameters = { page?: number; limit?: number; symbol?: string; name?: string };


export const getAllAssets = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['page', 'limit', 'symbol', 'name'] as const,
  bodyParams: [] as const,
  path: () => '/intel/v1/assets'
} as const;


export type getNewsFeedAssetsResponse = APIResponseWithMetadata<newsComponents['schemas']['AssetList'], newsComponents['schemas']['PaginationResult']>;
export type getNewsFeedAssetsError = newsComponents['schemas']['APIError'];

export type getNewsFeedAssetsParameters = { nameOrSymbol?: string; limit?: number; page?: number };


export const getNewsFeedAssets = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['nameOrSymbol', 'limit', 'page'] as const,
  bodyParams: [] as const,
  path: () => '/news/v1/news/assets'
} as const;


export type getNewsFeedResponse = APIResponseWithMetadata<newsComponents['schemas']['DocumentList'], newsComponents['schemas']['PaginationResult']>;
export type getNewsFeedError = newsComponents['schemas']['APIError'];

export type getNewsFeedParameters = { publishedBefore?: number; publishedAfter?: number; sourceTypes?: string[]; sourceIds?: string[]; assetIds?: string[]; sort?: number; limit?: number; page?: number };


export const getNewsFeed = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['publishedBefore', 'publishedAfter', 'sourceTypes', 'sourceIds', 'assetIds', 'sort', 'limit', 'page'] as const,
  bodyParams: [] as const,
  path: () => '/news/v1/news/feed'
} as const;


export type getNewsSourcesResponse = APIResponseWithMetadata<newsComponents['schemas']['SourceList'], newsComponents['schemas']['PaginationResult']>;
export type getNewsSourcesError = newsComponents['schemas']['APIError'];

export type getNewsSourcesParameters = { sourceName?: string; limit?: number; page?: number };


export const getNewsSources = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['sourceName', 'limit', 'page'] as const,
  bodyParams: [] as const,
  path: () => '/news/v1/news/sources'
} as const;
