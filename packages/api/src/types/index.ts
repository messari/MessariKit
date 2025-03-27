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


export type getAssetsV2Response = components['schemas']['V2AssetListItem'][];
export type getAssetsV2Error = components['schemas']['APIError'];

export type getAssetsV2Parameters = { category?: string; sector?: string; tags?: string[]; search?: string; limit?: number; hasDiligence?: boolean; hasIntel?: boolean; hasMarketData?: boolean; hasNews?: boolean; hasProposals?: boolean; hasResearch?: boolean; hasTokenUnlocks?: boolean; hasFundraising?: boolean };


export const getAssetsV2 = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['category', 'sector', 'tags', 'search', 'limit', 'hasDiligence', 'hasIntel', 'hasMarketData', 'hasNews', 'hasProposals', 'hasResearch', 'hasTokenUnlocks', 'hasFundraising'] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v2/assets'
} as const;


export type getAssetDetailsResponse = components['schemas']['V2Asset'][];
export type getAssetDetailsError = components['schemas']['APIError'];

export type getAssetDetailsParameters = { ids?: string; slugs?: string };


export const getAssetDetails = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['ids', 'slugs'] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v2/assets/details'
} as const;


export type getAssetsTimeseriesCatalogResponse = components['schemas']['TimeseriesCatalog'];
export type getAssetsTimeseriesCatalogError = components['schemas']['APIError'];

export type getAssetsTimeseriesCatalogParameters = null;


export const getAssetsTimeseriesCatalog = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v2/assets/metrics'
} as const;


export type getAssetTimeseriesResponse = components['schemas']['TimeseriesData'];
export type getAssetTimeseriesError = components['schemas']['APIError'];

export type getAssetTimeseriesParameters = { start?: string; end?: string } & { entityIdentifier: string; datasetSlug: string };


export const getAssetTimeseries = {
  method: 'GET' as const,
  pathParams: ['entityIdentifier', 'datasetSlug'] as const,
  queryParams: ['start', 'end'] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/metrics/v2/assets/${p.entityIdentifier}/metrics/${p.datasetSlug}/time-series`
} as const;


export type getAssetTimeseriesWithGranularityResponse = components['schemas']['TimeseriesData'];
export type getAssetTimeseriesWithGranularityError = components['schemas']['APIError'];

export type getAssetTimeseriesWithGranularityParameters = { start?: string; end?: string } & { entityIdentifier: string; datasetSlug: string; granularity: string };


export const getAssetTimeseriesWithGranularity = {
  method: 'GET' as const,
  pathParams: ['entityIdentifier', 'datasetSlug', 'granularity'] as const,
  queryParams: ['start', 'end'] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/metrics/v2/assets/${p.entityIdentifier}/metrics/${p.datasetSlug}/time-series/${p.granularity}`
} as const;


export type getAssetsV2ATHResponse = components['schemas']['V2AssetAthItem'][];
export type getAssetsV2ATHError = components['schemas']['APIError'];

export type getAssetsV2ATHParameters = { ids?: string; slugs?: string; category?: string; sector?: string; tags?: string[]; search?: string; limit?: number };


export const getAssetsV2ATH = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['ids', 'slugs', 'category', 'sector', 'tags', 'search', 'limit'] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v2/assets/ath'
} as const;


export type getAssetsV2ROIResponse = components['schemas']['V2AssetRoiItem'][];
export type getAssetsV2ROIError = components['schemas']['APIError'];

export type getAssetsV2ROIParameters = { ids?: string; slugs?: string; category?: string; sector?: string; tags?: string[]; search?: string; limit?: number };


export const getAssetsV2ROI = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['ids', 'slugs', 'category', 'sector', 'tags', 'search', 'limit'] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v2/assets/roi'
} as const;


export type getExchangesResponse = components['schemas']['Exchange'][];
export type getExchangesError = components['schemas']['APIError'];

export type getExchangesParameters = { type?: string; typeRankCutoff?: string; page?: number; pageSize?: number };


export const getExchanges = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['type', 'typeRankCutoff', 'page', 'pageSize'] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v1/exchanges'
} as const;


export type getExchangeResponse = components['schemas']['Exchange'];
export type getExchangeError = components['schemas']['APIError'];

export type getExchangeParameters = { exchangeIdentifier: string };


export const getExchange = {
  method: 'GET' as const,
  pathParams: ['exchangeIdentifier'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/metrics/v1/exchanges/${p.exchangeIdentifier}`
} as const;


export type getExchangeMetricsResponse = components['schemas']['TimeseriesCatalog'];
export type getExchangeMetricsError = components['schemas']['APIError'];

export type getExchangeMetricsParameters = null;


export const getExchangeMetrics = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v1/exchanges/metrics'
} as const;


export type getExchangeTimeseriesResponse = components['schemas']['TimeseriesData'];
export type getExchangeTimeseriesError = components['schemas']['APIError'];

export type getExchangeTimeseriesParameters = { start: string; end: string } & { entityIdentifier: string; datasetSlug: string; granularity: string };


export const getExchangeTimeseries = {
  method: 'GET' as const,
  pathParams: ['entityIdentifier', 'datasetSlug', 'granularity'] as const,
  queryParams: ['start', 'end'] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/metrics/v1/exchanges/${p.entityIdentifier}/metrics/${p.datasetSlug}/time-series/${p.granularity}`
} as const;


export type getMarketsResponse = components['schemas']['Market'][];
export type getMarketsError = components['schemas']['APIError'];

export type getMarketsParameters = { exchangeId?: string; exchangeSlug?: string; quoteAssetId?: string; quoteAssetSlug?: string; baseAssetId?: string; baseAssetSlug?: string; volume24hAbove?: string; volume24hBelow?: string };


export const getMarkets = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['exchangeId', 'exchangeSlug', 'quoteAssetId', 'quoteAssetSlug', 'baseAssetId', 'baseAssetSlug', 'volume24hAbove', 'volume24hBelow'] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v1/markets'
} as const;


export type getMarketResponse = components['schemas']['Market'];
export type getMarketError = components['schemas']['APIError'];

export type getMarketParameters = { marketIdentifier: string };


export const getMarket = {
  method: 'GET' as const,
  pathParams: ['marketIdentifier'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/metrics/v1/markets/${p.marketIdentifier}`
} as const;


export type getMarketMetricsResponse = components['schemas']['TimeseriesCatalog'];
export type getMarketMetricsError = components['schemas']['APIError'];

export type getMarketMetricsParameters = null;


export const getMarketMetrics = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v1/markets/metrics'
} as const;


export type getMarketTimeseriesResponse = components['schemas']['TimeseriesData'];
export type getMarketTimeseriesError = components['schemas']['APIError'];

export type getMarketTimeseriesParameters = { start: string; end: string } & { entityIdentifier: string; datasetSlug: string; granularity: string };


export const getMarketTimeseries = {
  method: 'GET' as const,
  pathParams: ['entityIdentifier', 'datasetSlug', 'granularity'] as const,
  queryParams: ['start', 'end'] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/metrics/v1/markets/${p.entityIdentifier}/metrics/${p.datasetSlug}/time-series/${p.granularity}`
} as const;


export type getNetworksResponse = components['schemas']['Network'][];
export type getNetworksError = components['schemas']['APIError'];

export type getNetworksParameters = { page?: number; pageSize?: number };


export const getNetworks = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['page', 'pageSize'] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v1/networks'
} as const;


export type getNetworkResponse = components['schemas']['Network'];
export type getNetworkError = components['schemas']['APIError'];

export type getNetworkParameters = { networkIdentifier: string };


export const getNetwork = {
  method: 'GET' as const,
  pathParams: ['networkIdentifier'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/metrics/v1/networks/${p.networkIdentifier}`
} as const;


export type getNetworkMetricsResponse = components['schemas']['TimeseriesCatalog'];
export type getNetworkMetricsError = components['schemas']['APIError'];

export type getNetworkMetricsParameters = null;


export const getNetworkMetrics = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/metrics/v1/networks/metrics'
} as const;


export type getNetworkTimeseriesResponse = components['schemas']['TimeseriesData'];
export type getNetworkTimeseriesError = components['schemas']['APIError'];

export type getNetworkTimeseriesParameters = { start: string; end: string } & { entityIdentifier: string; datasetSlug: string; granularity: string };


export const getNetworkTimeseries = {
  method: 'GET' as const,
  pathParams: ['entityIdentifier', 'datasetSlug', 'granularity'] as const,
  queryParams: ['start', 'end'] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/metrics/v1/networks/${p.entityIdentifier}/metrics/${p.datasetSlug}/time-series/${p.granularity}`
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


export type getTokenUnlockSupportedAssetsResponse = components['schemas']['TokenUnlockSupportedAsset'][];
export type getTokenUnlockSupportedAssetsError = components['schemas']['APIError'];

export type getTokenUnlockSupportedAssetsParameters = { assetIDs?: string; category?: string; sectors?: string; tags?: string };


export const getTokenUnlockSupportedAssets = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['assetIDs', 'category', 'sectors', 'tags'] as const,
  bodyParams: [] as const,
  path: () => '/token-unlocks/v1/assets'
} as const;


export type getTokenUnlockAllocationsResponse = components['schemas']['TokenUnlockAllocation'][];
export type getTokenUnlockAllocationsError = components['schemas']['APIError'];

export type getTokenUnlockAllocationsParameters = { assetIDs?: string };


export const getTokenUnlockAllocations = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: ['assetIDs'] as const,
  bodyParams: [] as const,
  path: () => '/token-unlocks/v1/allocations'
} as const;


export type getTokenUnlockVestingScheduleResponse = components['schemas']['TokenUnlockVestingSchedule'];
export type getTokenUnlockVestingScheduleError = components['schemas']['APIError'];

export type getTokenUnlockVestingScheduleParameters = { startTime: string; endTime: string } & { assetId: string };


export const getTokenUnlockVestingSchedule = {
  method: 'GET' as const,
  pathParams: ['assetId'] as const,
  queryParams: ['startTime', 'endTime'] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/token-unlocks/v1/assets/${p.assetId}/vesting-schedule`
} as const;


export type getTokenUnlocksResponse = components['schemas']['TokenUnlockUnlocks'];
export type getTokenUnlocksError = components['schemas']['APIError'];

export type getTokenUnlocksParameters = { startTime: string; endTime: string; interval: string } & { assetId: string };


export const getTokenUnlocks = {
  method: 'GET' as const,
  pathParams: ['assetId'] as const,
  queryParams: ['startTime', 'endTime', 'interval'] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/token-unlocks/v1/assets/${p.assetId}/unlocks`
} as const;


export type getTokenUnlockEventsResponse = components['schemas']['TokenUnlockEvent'];
export type getTokenUnlockEventsError = components['schemas']['APIError'];

export type getTokenUnlockEventsParameters = { startTime?: string; endTime?: string } & { assetId: string };


export const getTokenUnlockEvents = {
  method: 'GET' as const,
  pathParams: ['assetId'] as const,
  queryParams: ['startTime', 'endTime'] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/token-unlocks/v1/assets/${p.assetId}/events`
} as const;


export type getTeamAllowanceResponse = components['schemas']['AllowanceInfo'];
export type getTeamAllowanceError = components['schemas']['APIError'];

export type getTeamAllowanceParameters = null;


export const getTeamAllowance = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/user-management/v1/api/credits/allowance'
} as const;


export type getPermissionsResponse = components['schemas']['PermissionsResponse'];
export type getPermissionsError = components['schemas']['APIError'];

export type getPermissionsParameters = null;


export const getPermissions = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/user-management/v1/api/permissions'
} as const;


export type listWatchlistsResponse = components['schemas']['Watchlist'][];
export type listWatchlistsError = components['schemas']['APIError'];

export type listWatchlistsParameters = null;


export const listWatchlists = {
  method: 'GET' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: () => '/user-management/v1/watchlists'
} as const;


export type createWatchlistResponse = components['schemas']['Watchlist'];
export type createWatchlistError = components['schemas']['APIError'];

export type createWatchlistParameters = components['schemas']['CreateWatchlistRequest'];


export const createWatchlist = {
  method: 'POST' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: ['assetIds', 'title'] as const,
  path: () => '/user-management/v1/watchlists'
} as const;


export type deleteWatchlistResponse = void;
export type deleteWatchlistError = components['schemas']['APIError'];

export type deleteWatchlistParameters = { id: string };


export const deleteWatchlist = {
  method: 'DELETE' as const,
  pathParams: ['id'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/user-management/v1/watchlists/${p.id}`
} as const;


export type getWatchlistResponse = components['schemas']['Watchlist'];
export type getWatchlistError = components['schemas']['APIError'];

export type getWatchlistParameters = { id: string };


export const getWatchlist = {
  method: 'GET' as const,
  pathParams: ['id'] as const,
  queryParams: [] as const,
  bodyParams: [] as const,
  path: (p: PathParams) => `/user-management/v1/watchlists/${p.id}`
} as const;


export type updateWatchlistResponse = components['schemas']['Watchlist'];
export type updateWatchlistError = components['schemas']['APIError'];

export type updateWatchlistParameters = components['schemas']['UpdateWatchlistRequest'] & { id: string };


export const updateWatchlist = {
  method: 'PATCH' as const,
  pathParams: ['id'] as const,
  queryParams: [] as const,
  bodyParams: ['assetIds', 'title', 'watchlistID'] as const,
  path: (p: PathParams) => `/user-management/v1/watchlists/${p.id}`
} as const;


export type modifyWatchlistAssetsResponse = components['schemas']['Watchlist'];
export type modifyWatchlistAssetsError = components['schemas']['APIError'];

export type modifyWatchlistAssetsParameters = components['schemas']['ModifyWatchlistAssetsRequest'] & { id: string };


export const modifyWatchlistAssets = {
  method: 'PATCH' as const,
  pathParams: ['id'] as const,
  queryParams: [] as const,
  bodyParams: ['action', 'assetIds', 'watchlistID'] as const,
  path: (p: PathParams) => `/user-management/v1/watchlists/${p.id}/assets`
} as const;

// Re-export schema types
export * from './schema';
