import type { components } from './types';


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


export type getAssetListResponse = APIResponseWithMetadata<components['schemas']['BasicAsset'][], components['schemas']['PaginationResult']>;
export type getAssetListError = components['schemas']['APIError'];

export type getAssetListParameters = { page?: number; limit?: number; symbol?: string; name?: string; category?: string; sector?: string; tags?: string };


export const getAssetList = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['page', 'limit', 'symbol', 'name', 'category', 'sector', 'tags'] as const,
  bodyParams: [] as const,
  path: () => '/asset/v1/assets'
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


export type getAssetMarketdataResponse = components['schemas']['AssetMarketData'];
export type getAssetMarketdataError = components['schemas']['APIError'];

export type getAssetMarketdataParameters = { assetId: string };


export const getAssetMarketdata = {
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


export type getProjectRecapResponse = components['schemas']['GetProjectRecapResponse'];
export type getProjectRecapError = components['schemas']['APIError'];

export type getProjectRecapParameters = { project_id: string };


export const getProjectRecap = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['project_id'] as const,
  bodyParams: [] as const,
  path: () => '/ai-digest/api/v1/recap'
} as const;


export type getExchangeRecapResponse = components['schemas']['ExchangeRecap'];
export type getExchangeRecapError = components['schemas']['APIError'];

export type getExchangeRecapParameters = { exchange_id: string };


export const getExchangeRecap = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['exchange_id'] as const,
  bodyParams: [] as const,
  path: () => '/ai-digest/api/v1/exchange-recap'
} as const;


export type getExchangeRankingsRecapResponse = components['schemas']['ExchangeRankingsRecap'];
export type getExchangeRankingsRecapError = components['schemas']['APIError'];

export type getExchangeRankingsRecapParameters = { period?: string };


export const getExchangeRankingsRecap = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['period'] as const,
  bodyParams: [] as const,
  path: () => '/ai-digest/api/v1/exchange-rankings-recap'
} as const;


export type getResearchReportsResponse = components['schemas']['ResearchReport'][];
export type getResearchReportsError = components['schemas']['APIError'];

export type getResearchReportsParameters = { page?: number; limit?: number; assetId?: string; tags?: string; contentType: string };


export const getResearchReports = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['page', 'limit', 'assetId', 'tags', 'contentType'] as const,
  bodyParams: [] as const,
  path: () => '/research/v1/reports'
} as const;


export type getResearchReportByIdResponse = components['schemas']['ResearchReport'];
export type getResearchReportByIdError = components['schemas']['APIError'];

export type getResearchReportByIdParameters = { id: string };


export const getResearchReportById = {
  method: 'GET' as const,
  pathParams: ['id'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/research/v1/reports/${p.id}`
} as const;


export type getResearchReportTagsResponse = string[];
export type getResearchReportTagsError = components['schemas']['APIError'];

export type getResearchReportTagsParameters = null;


export const getResearchReportTags = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/research/v1/reports/tags'
} as const;


export type getPreviewsResponse = components['schemas']['GetPreviewsResponse'];
export type getPreviewsError = components['schemas']['APIError'];

export type getPreviewsParameters = { sector?: string; isDefaultIncluded?: boolean; isPublished?: boolean; isPurchased?: boolean; sort?: string; order?: string };


export const getPreviews = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['sector', 'isDefaultIncluded', 'isPublished', 'isPurchased', 'sort', 'order'] as const,
  bodyParams: [] as const,
  path: () => '/diligence/v1/reports/preview'
} as const;


export type getReportByAssetIDResponse = components['schemas']['AssetReport'];
export type getReportByAssetIDError = components['schemas']['APIError'];

export type getReportByAssetIDParameters = { assetId: string };


export const getReportByAssetID = {
  method: 'GET' as const,
  pathParams: ['assetId'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/diligence/v1/report/asset/${p.assetId}`
} as const;


export type getFundingRoundsResponse = components['schemas']['FundingRound'][];
export type getFundingRoundsError = components['schemas']['APIError'];

export type getFundingRoundsParameters = { fundedEntityId?: string; investorId?: string; type?: string; stage?: string; raisedAmountMax?: number; raisedAmountMin?: number; isTokenFunded?: boolean; announcedBefore?: string; announcedAfter?: string; page?: number; limit?: number };


export const getFundingRounds = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['fundedEntityId', 'investorId', 'type', 'stage', 'raisedAmountMax', 'raisedAmountMin', 'isTokenFunded', 'announcedBefore', 'announcedAfter', 'page', 'limit'] as const,
  bodyParams: [] as const,
  path: () => '/funding/v1/rounds'
} as const;


export type getFundingRoundsInvestorsResponse = components['schemas']['Investors'][];
export type getFundingRoundsInvestorsError = components['schemas']['APIError'];

export type getFundingRoundsInvestorsParameters = { fundedEntityId?: string; investorId?: string; type?: string; stage?: string; raisedAmountMax?: number; raisedAmountMin?: number; isTokenFunded?: boolean; announcedBefore?: string; announcedAfter?: string; page?: number; limit?: number };


export const getFundingRoundsInvestors = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['fundedEntityId', 'investorId', 'type', 'stage', 'raisedAmountMax', 'raisedAmountMin', 'isTokenFunded', 'announcedBefore', 'announcedAfter', 'page', 'limit'] as const,
  bodyParams: [] as const,
  path: () => '/funding/v1/rounds/investors'
} as const;


export type getAcquisitionDealsResponse = components['schemas']['AcquisitionDeal'][];
export type getAcquisitionDealsError = components['schemas']['APIError'];

export type getAcquisitionDealsParameters = { acquiringEntityId?: string; acquiredEntityId?: string; transactionAmountMin?: number; transactionAmountMax?: number; announcedBefore?: string; announcedAfter?: string; page?: number; limit?: number };


export const getAcquisitionDeals = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['acquiringEntityId', 'acquiredEntityId', 'transactionAmountMin', 'transactionAmountMax', 'announcedBefore', 'announcedAfter', 'page', 'limit'] as const,
  bodyParams: [] as const,
  path: () => '/funding/v1/mergers-and-acquisitions'
} as const;


export type getOrganizationsResponse = components['schemas']['Organization'][];
export type getOrganizationsError = components['schemas']['APIError'];

export type getOrganizationsParameters = { id?: string; category?: string; sector?: string; tags?: string; foundedBefore?: string; foundedAfter?: string; page?: number; limit?: number };


export const getOrganizations = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['id', 'category', 'sector', 'tags', 'foundedBefore', 'foundedAfter', 'page', 'limit'] as const,
  bodyParams: [] as const,
  path: () => '/funding/v1/organizations'
} as const;


export type getProjectsResponse = components['schemas']['Project'][];
export type getProjectsError = components['schemas']['APIError'];

export type getProjectsParameters = { id?: string; category?: string; sector?: string; tags?: string; foundedBefore?: string; foundedAfter?: string; page?: number; limit?: number };


export const getProjects = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['id', 'category', 'sector', 'tags', 'foundedBefore', 'foundedAfter', 'page', 'limit'] as const,
  bodyParams: [] as const,
  path: () => '/funding/v1/projects'
} as const;

// Re-export schema types
export * from './schema';
