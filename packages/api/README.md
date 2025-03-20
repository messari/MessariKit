# Messari SDK

Messari Typescript SDK is a convenient way to interact with Messari's APIs. It provides a type-safe, intuitive interface for accessing Messari's suite of crypto data and AI services.

## Features

- 🔒 **Type-safe**: Full TypeScript support with automatically generated types from OpenAPI specs
- 🚀 **Modern**: Built with modern TypeScript features and best practices
- 📚 **Well-documented**: Comprehensive documentation and examples
- 🔄 **Auto-generated**: API types and operations are automatically generated from OpenAPI specifications
- 🛠 **Developer-friendly**: Intuitive API design with built-in error handling

## Installation

```bash
# Using pnpm
pnpm add @messari/sdk
```

## Authorization

To use the SDK, you'll need a Messari API key. You can get one by logging into [messari.io](https://messari.io/)
 and visiting the [Account Page](https://messari.io/account).


## API Services

| Service | Endpoint  |  Route |
|--------------|---------------|----------------|
| AI | Chat Completion | `/ai/v1/chat/completions` |
| AI | Entity Extraction | `/ai/v1/classification/extraction` | 
| Asset | Asset List | `/metrics/v2/assets` |
| Asset | Asset Details | `/metrics/v2/assets/details` |
| Asset | Asset ATH | `/metrics/v2/assets/{assetSlug}/ath` |
| Asset | Asset ROIs | `/metrics/v2/assets/{assetSlug}/rois` |
| Asset | Asset Metrics Catalog | `/metrics/v2/assets/metrics-catalog` |
| Asset | Asset Metrics Timeseries | `/metrics/v2/assets/{assetSlug}/metrics/{datasetSlug}/time-series/{granularity}` |


## Example Usage

### AI Service

```typescript
import { MessariClient } from '@messari/sdk';

// Initialize the client
const client = new MessariClient({ apiKey: 'your-api-key' });

// Use the AI service
const response = await client.ai.createChatCompletion({
  messages: [
    {
      role: "user",
      content: "What companies have both paradigm and multicoin on their cap table?",
    },
  ],
});
const assistantMessage = response.messages[0].content;
console.log(assistantMessage);
// The following companies have both Paradigm and a16z on their cap table:
// 1. OpenSea
// 2. Optimism
// 3. Phantom Wallet
// 4. Farcaster
// 5. Uniswap
// ...


// Extract entities from text
const entitiesResp = await client.ai.extractEntities({
    content: "Ethereum founder Vitalik Buterin announced...",
    entityTypes: ["person", "project"],
});

for (const entity of entitiesResp.extractedEntities) {
    if (entity.selectedEntity) {
        console.log(JSON.stringify(entity.selectedEntity, null, 2));
    }
}
// {
//   "name": "Ethereum",
//   "details": [
//     {
//       "id": "263d8b01-5a96-41f0-85d5-09687bbbf7ca",
//       "type": "PROJECT"
//     }
//   ],
//   "confidenceScore": "HIGH",
//   "relevanceScore": "HIGH"
// }
// {
//   "name": "Vitalik Buterin",
//   "details": [
//     {
//       "id": "77b6685d-fafa-4be2-8e79-563c438a880a",
//       "type": "PERSON"
//     }
//   ],
//   "confidenceScore": "HIGH",
//   "relevanceScore": "HIGH"
// }

```


### Asset Service - Asset List & Details

```typescript
// Get all assets with market data coverage
const response = await client.asset.getAssetsV2({has_market_data: true});
console.log(response.data);
// [
//   {
//     "id": "1e31218a-e44e-4285-820c-8282ee222035",
//     "name": "Bitcoin",
//     "slug": "bitcoin",
//     "symbol": "BTC",
//     "category": "Cryptocurrency",
//     "sector": "Cryptocurrency",
//     "tags": [ "Proof-of-Work" ],
//     "rank": 1,
//     "has_diligence": true,
//     "has_intel": true,
//     "has_market_data": true,
//     "has_news": true,
//     "has_proposals": false,
//     "has_research": true,
//     "has_token_unlocks": false,
//     "has_fundraising": false
//   }
//   ...
// ]


// Get full asset details by slug
const assetResp = await client.asset.getAssetDetails({slugs: "bitcoin"});
console.log(assetResp.data);
// [
//   {
//     "id": "1e31218a-e44e-4285-820c-8282ee222035",
//     "name": "Bitcoin",
//     "slug": "bitcoin",
//     "symbol": "BTC",
//     "rank": 1,
//     "category": "Cryptocurrency",
//     "sector": "Cryptocurrency",
//     "tags": [ "Proof-of-Work"],
//     "description": "",
//     "links": [],
//     "marketData": {
//         "priceUsd": 83489.83024973852,
//         "priceBtc": 1,
//         "priceEth": 42.989433916716074,
//         "volume24Hour": 14763167148.901848,
//         "ohlcv1HourUsd": {
//             "open": 83489.83024973852,
//             "high": 83490.51819769824,
//             "low": 83167.96186726008,
//             "close": 83489.83024973852,
//             "volume": 351435576.76516294
//         },
//         "ohlcv24HourUsd": {
//             "open": 83489.83024973852,
//             "high": 83490.51819769824,
//             "low": 82539.14757820722,
//             "close": 83489.83024973852,
//             "volume": 4265512222.814844
//         },
//         "supply": {
//             "circulating": 19838712,
//             "total": 21000000,
//             "max": 21000000
//         },
//         "marketcap": {
//             "circulatingUsd": 1651240117533,
//             "fullyDilutedUsd": 1651240117533,
//             "dominance": 58.2992
//         }
//     },
//     "networkSlugs": [
//         "bitcoin"
//     ],
//     "protocolSlugs": [],
//     "returnOnInvestment": {
//         "priceChange24h": 0.24334394850368413,
//         "priceChange7d": 0.9588618347122231,
//         "priceChange30d": -13.168077682177422,
//         "priceChange1y": 31.608562424855098,
//         "priceChange3y": 102.32632635961043,
//         "priceChange5y": 1244.5178649072277,
//         "priceChangeMTD": -1.0261448570562424,
//         "priceChangeQTD": -10.585881290341472,
//         "priceChangeYTD": -10.585881290341472
//     },
//     "allTimeHigh": {
//         "allTimeHigh": 109100.29566458709,
//         "allTimeHighDate": "2025-01-20T06:00:00Z",
//         "allTimeHighTimeSinceSeconds": 5020864,
//         "allTimeHighPercentDown": 23.474240156,
//         "breakevenMultiple": 1.3067495207289488,
//         "cycleLow": 76647.12627280613,
//         "cycleLowDate": "2025-03-11T00:00:00Z",
//         "cycleLowTimeSinceSeconds": 722462,
//         "cycleLowPercentUp": 8.927541461342607
//     }
//   },
//   ...
// ] 
```

### Asset Service - Asset ATH & ROI

```typescript
// Get all-time high information for assets
const athResp = await client.asset.getAssetsV2ATH({slugs: "bitcoin,ethereum"});
console.log(athResp.data);
// [
//   {
//     "id": "1e31218a-e44e-4285-820c-8282ee222035",
//     "name": "Bitcoin",
//     "slug": "bitcoin",
//     "symbol": "BTC",
//     "category": "Cryptocurrency",
//     "sector": "Cryptocurrency",
//     "tags": [
//         "Proof-of-Work"
//     ],
//     "allTimeHigh": {
//         "allTimeHigh": 109100.29566458709,
//         "allTimeHighDate": "2025-01-20T06:00:00Z",
//         "allTimeHighTimeSinceSeconds": 5129108,
//         "allTimeHighPercentDown": 21.03109359209297,
//         "breakevenMultiple": 1.2663211958825753,
//         "cycleLow": 76647.12627280613,
//         "cycleLowDate": "2025-03-11T00:00:00Z",
//         "cycleLowTimeSinceSeconds": 830708,
//         "cycleLowPercentUp": 12.405141019207322
//     }
//   },
//   {
//       "id": "21c795f5-1bfd-40c3-858e-e9d7e820c6d0",
//       "name": "Ethereum",
//       "slug": "ethereum",
//       "symbol": "ETH",
//       "category": "Networks",
//       "sector": "Smart Contract Platform",
//       "tags": [
//           "EVM",
//           "Proof-of-Stake",
//           "Stakeable"
//       ],
//       "allTimeHigh": {
//           "allTimeHigh": 4864.732372655,
//           "allTimeHighDate": "2021-11-10T14:00:00Z",
//           "allTimeHighTimeSinceSeconds": 105929108,
//           "allTimeHighPercentDown": 58.8686011905188,
//           "breakevenMultiple": 2.4312326566668823,
//           "cycleLow": 884.7595097775664,
//           "cycleLowDate": "2022-06-18T20:00:00Z",
//           "cycleLowTimeSinceSeconds": 86899508,
//           "cycleLowPercentUp": 126.15552035306304
//       }
//   }
// ]

// Get return on investment information for assets
const roiResp = await client.asset.getAssetsV2ROI({slugs: "bitcoin,ethereum"});
console.log(roiResp.data);
// [
//   {
//     "id": "1e31218a-e44e-4285-820c-8282ee222035",
//     "name": "Bitcoin",
//     "slug": "bitcoin",
//     "symbol": "BTC",
//     "category": "Cryptocurrency",
//     "sector": "Cryptocurrency",
//     "tags": [
//         "Proof-of-Work"
//     ],
//     "returnOnInvestment": {
//         "priceChange24h": 2.209060287034732,
//         "priceChange7d": 5.092565157624844,
//         "priceChange30d": -9.823168395528233,
//         "priceChange1y": 34.092280580285426,
//         "priceChange3y": 109.956754647202,
//         "priceChange5y": 1291.1371260356618,
//         "priceChangeMTD": 2.1336752423207175,
//         "priceChangeQTD": -7.731263481842383,
//         "priceChangeYTD": -7.731263481842383
//     }
//   },
//   {
//     "id": "21c795f5-1bfd-40c3-858e-e9d7e820c6d0",
//     "name": "Ethereum",
//     "slug": "ethereum",
//     "symbol": "ETH",
//     "category": "Networks",
//     "sector": "Smart Contract Platform",
//     "tags": [
//         "EVM",
//         "Proof-of-Stake",
//         "Stakeable"
//     ],
//     "returnOnInvestment": {
//         "priceChange24h": -1.4703934109432193,
//         "priceChange7d": 6.18024903092911,
//         "priceChange30d": -25.585586034027752,
//         "priceChange1y": -40.90657927251894,
//         "priceChange3y": -30.83750463914012,
//         "priceChange5y": 1407.1385288074712,
//         "priceChangeMTD": -10.580239843311466,
//         "priceChangeQTD": -39.91640163446017,
//         "priceChangeYTD": -39.91640163446017
//     }
//   }
// ]
```

### Asset Service - Asset Metrics Catalog & Price Timeseries

```typescript
// Get asset metrics catalog
const metricsCatalogResp = await client.asset.getAssetsTimeseriesCatalog();
console.log(metricsCatalogResp.data.datasets);
// [
//   {
//     "slug": "price",
//     "granularities": [
//         "1h",
//         "1d",
//         "1w"
//     ],
//     "metrics": [
//         {
//             "name": "Timestamp",
//             "slug": "time",
//             "description": "Timestamp of the data point.",
//             "is_timestamp": true
//         },
//         {
//             "name": "Open Price",
//             "slug": "open",
//             "description": "Price at the candle open.",
//             "is_timestamp": false
//         },
//         {
//             "name": "High Price",
//             "slug": "high",
//             "description": "High price during the candle.",
//             "is_timestamp": false
//         },
//         {
//             "name": "Low Price",
//             "slug": "low",
//             "description": "Low price during the candle.",
//             "is_timestamp": false
//         },
//         {
//             "name": "Close Price",
//             "slug": "close",
//             "description": "Price at the candle close.",
//             "is_timestamp": false
//         },
//         {
//             "name": "Volume",
//             "slug": "volume",
//             "description": "Volume traded during candle.",
//             "is_timestamp": false
//         }
//     ]
//   },
//   ...
// ]

// Get asset price timeseries metrics
const priceTimeseriesResp = await client.asset.getAssetTimeseriesWithGranularity({
    entityIdentifier: "bitcoin",
    datasetSlug: "price",
    granularity: "1d",
      start: "2025-01-01T00:00:00Z",
      end: "2025-01-07T00:00:00Z",
});
console.log(priceTimeseriesResp.data.points);
// [
//   [
//     1735689600,
//     93390.10249380038,
//     94944.36655871246,
//     92823.27427758025,
//     94392.70949576062,
//     14203475459.832247
//   ],
//   [
//     1735776000,
//     94419.37796015314,
//     97730.69349081015,
//     94277.44946108467,
//     96827.60175883348,
//     27529935541.809467
//   ]
// ]
console.log(priceTimeseriesResp.metadata.pointSchemas);
// [
//   {
//     "name": "Timestamp",
//     "slug": "time",
//     "description": "Timestamp of the data point.",
//     "is_timestamp": true
//   },
//   {
//     "name": "Open Price",
//     "slug": "open",
//     "description": "Price at the candle open.",
//     "is_timestamp": false
//   },
//   {
//     "name": "High Price",
//     "slug": "high",
//     "description": "High price during the candle.",
//     "is_timestamp": false
//   },
//   {
//     "name": "Low Price",
//     "slug": "low",
//     "description": "Low price during the candle.",
//     "is_timestamp": false
//   },
//   {
//     "name": "Close Price",
//     "slug": "close",
//     "description": "Price at the candle close.",
//     "is_timestamp": false
//   },
//   {
//     "name": "Volume",
//     "slug": "volume",
//     "description": "Volume traded during candle.",
//     "is_timestamp": false
//   }
// ]
```

