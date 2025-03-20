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

## API Services

| Service | Endpoint  |  Route |
|--------------|---------------|----------------|
| AI | Chat Completion | `/ai/v1/chat/completions` |
| AI | Entity Extraction | `/ai/v1/classification/extraction` | 
| Asset | Asset List | `/metrics/v2/assets` |
| Asset | Asset Details | `/metrics/v2/assets/details` |
| Asset | Asset Metrics Time Series | `/metrics/v2/assets/{assetSlug}/metrics/{datasetSlug}/time-series/{granularity}` |

## Authorization

To use the SDK, you'll need a Messari API key. You can get one by logging into [messari.io](https://messari.io/)
 and visiting the [Account Page](https://messari.io/account).

## Example Usage - AI Service

```typescript
import { MessariClient } from '@messari/sdk';

// Initialize the client
const client = new MessariClient({
  apiKey: 'your-api-key'
});

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


