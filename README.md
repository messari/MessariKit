# MessariKit

This repository defines the OpenAPI specifications and types for the official TypeScript SDK. The purpose of the SDK is to provide a type-safe, intuitive interface for accessing Messari's suite of crypto data and AI services. 

## Project Structure

The repository is organized as follows:

- `packages/api`: The SDK package that we publish to npm for consumption.
- `packages/examples`: A demo project that implements examples of the SDK in action for the various services: AI, Asset, Intel, News, etc.
- `typegen`: The OpenAPI specifications and type generation scripts. Used for updating the SDK types and operations.

```
├── packages/
│   └── api/
│       └── src/
│           ├── types.ts        # Generated API types from OpenAPI
│           ├── schema.ts       # Re-exported schema types
│           └── index.ts        # Generated operations and re-exports
│   └── examples/
│       └── src/
│           ├── ai.ts           # Example usage of the AI service
│           ├── asset/
│              ├── asset.ts     # Example usage of the Asset service
│              ├── ath.ts       # Example usage of the Asset service - ATHs
│              ├── roi.ts       # Example usage of the Asset service - ROIs
├── typegen/
│   ├── openapi/
│   │   ├── common/            # Shared OpenAPI components
│   │   ├── services/          # Service-specific OpenAPI specs
│   │   ├── index.yaml         # Main entry point that combines all services
│   │   └── dist/              # Bundled OpenAPI specs
│   └── scripts/               # Type generation scripts
└── package.json
```

## API Services & Implementation Status

List of services currently implemented in the SDK, more services will be added over time.
For the full list of APIs, see the [API Reference Docs](https://docs.messari.io/reference/introduction).

| Service Name | Endpoint Name | Endpoint Route | Implemented |
|--------------|---------------|----------------|-------------|
| AI | Chat Completion | `/ai/v1/chat/completions` | ✅ |
| AI | Entity Extraction | `/ai/v1/classification/extraction` | ✅ |
| |
| Asset | Asset List | `/metrics/v2/assets` | ✅ |
| Asset | Asset Details | `/metrics/v2/assets/details` | ✅ |
| Asset | Asset ATHs | `/metrics/v2/assets/ath` | ✅ |
| Asset | Asset ROIs | `/metrics/v2/assets/roi` | ✅ |
| Asset | Asset Metrics | `/metrics/v2/assets/metrics` | ✅ |
| Asset | Asset Price Time Series | `/metrics/v2/assets/{assetId}/metrics/price/time-series/{granularity}` | ✅ |
| |
| Exchanges | Exchanges | `/metrics/v1/exchanges` | ✅ |
| Exchanges | Exchange Details | `/metrics/v1/exchanges/{exchangeIdentifier}` | ✅ |
| Exchanges | Exchange Metrics | `/metrics/v1/exchanges/metrics` | ✅ |
| Exchanges | Exchange Timeseries | `/metrics/v1/exchanges/{entityIdentifier}/metrics/{datasetSlug}/time-series/{granularity}` | ✅ |
| |
| Markets | Markets | `/metrics/v1/markets` | ✅ |
| Markets | Market Details | `/metrics/v1/markets/{marketIdentifier}` | ✅ |
| Markets | Market Metrics | `/metrics/v1/markets/metrics` | ✅ |
| Markets | Market Timeseries | `/metrics/v1/markets/{entityIdentifier}/metrics/{datasetSlug}/time-series/{granularity}` | ✅ |
| |
| Networks | Networks | `/metrics/v1/networks` | ✅ |
| Networks | Network Details | `/metrics/v1/networks/{networkIdentifier}` | ✅ |
| Networks | Network Metrics | `/metrics/v1/networks/metrics` | ✅ |
| Networks | Network Timeseries | `/metrics/v1/networks/{entityIdentifier}/metrics/{datasetSlug}/time-series/{granularity}` | ✅ |
| |
| Intel | Events | `/intel/v1/events` | 🚧 |
| Intel | Events By ID | `/intel/v1/events/{eventId}` | 🚧 |
| Intel | Intel Assets | `/intel/v1/assets` | 🚧 |
| |
| News | News Assets | `/news/v1/news/assets` | 🚧 |
| News | News Feed | `/news/v1/news/feed` | 🚧 |
| News | News Sources | `/news/v1/news/sources` | 🚧 |
| |
| AI Digest | Project Recap By ID | `/ai-digest/api/v1/recap` | ❌ |
| AI Digest | Exchange Recaps Overview | `/ai-digest/api/v1/exchange-rankings-recap` | ❌ |
| AI Digest | Exchange Recap By ID | `/ai-digest/api/v1/exchange-recap` | ❌ |
| |
| Research | Reports | `/research/v1/reports` | 🚧 |
| Research | Report By ID | `/research/v1/reports/{id}` | 🚧 |
| Research | Report Tags | `/research/v1/reports/tags` | 🚧 |
| |
| Diligence | Report Preview | `/diligence/v1/reports/preview` | 🚧 |
| Diligence | Report By Asset ID | `/diligence/v1/report/asset/{assetId}` | 🚧 |
| |
| Fundraising | Funding Rounds | `/funding/v1/rounds` | 🚧 |
| Fundraising | Funding Rounds Investors | `/funding/v1/rounds/investors` | 🚧 |
| Fundraising | Mergers and Acquisitions | `/funding/v1/mergers-and-acquisitions` | 🚧 |
| Fundraising | Organizations | `/funding/v1/organizations` | 🚧 |
| Fundraising | Projects | `/funding/v1/projects` | 🚧 |

## Generating Types

To regenerate types after modifying OpenAPI specs:

```bash
# Install dependencies
pnpm install

# Generate types & build the SDK
pnpm run api:build
```

## Using the SDK

For detailed SDK usage, see the [README](packages/api/README.md).

### ⚠️ Important Type Generation Rules

1. **Never run type generation scripts directly**. Always use the package.json scripts from the root directory:
   ```bash
   pnpm api:build
   ```

2. **Service Registration**: When creating a new service, you must register it in `typegen/openapi/index.yaml`:
   - Add paths to your service's endpoints
   - Add tags for your service
   - Reference your service's OpenAPI file

3. **Schema Name Uniqueness**: Schema names must be unique across all services. Since all schemas are combined into a single namespace, duplicate names will cause conflicts.
   - Example: If `intel` service has an `Asset` schema and `news` service also has an `Asset` schema, they will conflict
   - Solution: Use service-specific prefixes (e.g., `NewsAsset` vs `IntelAsset`)

4. **Common Components**: Use the common components in `typegen/openapi/common/` for shared schemas:
   - `PaginationResult` for pagination metadata
   - `APIResponseWithMetadata` for standard response wrapper
   - `APIError` for error responses

5. **DRY Principle**: Don't repeat common schemas in service-specific files. Instead, reference them:
   ```yaml
   PaginationResult:
     $ref: '../../common/components.yaml#/components/schemas/PaginationResult'
   ```

6. **Handling Type Collisions**: When multiple services define types with the same name:
   - For identical types used across services: Move these to `/openapi/common/components.yaml`
   - For different types with the same name: Use service-specific prefixes (e.g., `IntelAsset` vs `NewsAsset`)

7. **Common Issues**:
   - Missing pagination parameters: Ensure referenced parameters are properly handled in the generation scripts
   - Type mismatches: Verify OpenAPI specs and run `pnpm api:build` to regenerate all types

For more detailed information on the type generation process, see the [Type Generation README](typegen/README.md).

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Documentation](https://docs.messari.io)
- [API Reference](https://docs.messari.io/reference/introduction)
- [GitHub Issues](https://github.com/messari/messari-kit/issues) 