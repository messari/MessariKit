# MessariKit

MessariKit is the official TypeScript/JavaScript SDK for interacting with Messari's APIs. It provides a type-safe, intuitive interface for accessing Messari's suite of crypto data and AI services.

## API Services

| Service Name | Endpoint Name | Endpoint Route | Implemented |
|--------------|---------------|----------------|-------------|
| AI | Chat Completion | `/ai/v1/chat/completions` | ✅ |
| AI | Entity Extraction | `/ai/v1/classification/extraction` | ✅ |
| |
| Asset | Asset List | `/asset/v1/assets` | 🚧 |
| Asset | Asset By ID | `/asset/v1/assets/{assetId}` | ❌ |
| |
| Intel | Events | `/intel/v1/events` | 🚧 |
| Intel | Events By ID | `/intel/v1/events/{eventId}` | 🚧 |
| Intel | Intel Assets | `/intel/v1/assets` | 🚧 |
| |
| News | News Assets | `/news/v1/news/assets` | 🚧 |
| News | News Feed | `/news/v1/news/feed` | 🚧 |
| News | News Sources | `/news/v1/news/sources` | 🚧 |
| |
| Marketdata | Marketdata by AssetID | `/marketdata/v1/assets/{assetId}/price` | 🚧 |
| Marketdata | ROI | `/marketdata/v1/assets/roi` | 🚧 |
| Marketdata | ROI by AssetID | `/marketdata/v1/assets/{assetId}/roi` | 🚧 |
| Marketdata | ATH | `/marketdata/v1/assets/ath` | 🚧 |
| Marketdata | ATH by Asset | `/marketdata/v1/assets/{assetId}/ath` | 🚧 |
| Marketdata | Timeseries by AssetID | `/marketdata/v1/assets/{assetId}/price/time-series` | ❌ |
| Marketdata | Markets | `/marketdata/v1/markets` | ❌ |
| Marketdata | Markets by MarketID | `/marketdata/v1/markets/{id}` | ❌ |
| Marketdata | Timeseries by MarketID | `/marketdata/v1/markets/{marketId}/price/time-series` | ❌ |
| Marketdata | Markets by MarketID | `/marketdata/v1/markets/{id}` | ❌ |
| Marketdata | Exchanges | `/marketdata/v1/exchanges` | ❌ |
| Marketdata | Volume Timeseries by ExchangeID | `/marketdata/v1/exchanges/{exchangeId}/volume/time-series` | ❌ |
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



### AI Service

The AI service provides access to Messari's AI-powered features:

- Chat Completions: Engage in context-aware conversations about crypto
- Entity Extraction: Extract and classify entities from text content

## Development

### Project Structure

```
├── packages/
│   └── types/
│       └── src/
│           ├── types.ts        # Generated API types from OpenAPI
│           ├── schema.ts       # Re-exported schema types
│           └── index.ts        # Generated operations and re-exports
├── typegen/
│   ├── openapi/
│   │   ├── common/            # Shared OpenAPI components
│   │   ├── services/          # Service-specific OpenAPI specs
│   │   ├── index.yaml         # Main entry point that combines all services
│   │   └── dist/              # Bundled OpenAPI specs
│   └── scripts/               # Type generation scripts
└── package.json
```

### Building

```bash
# Install dependencies
pnpm install

# Generate API types and bundles
pnpm run api:build

# Build the SDK
pnpm run build
```

### Type Generation

The SDK uses a multi-step type generation process:

1. OpenAPI specs are validated (`pnpm api:validate`)
2. OpenAPI specs are bundled into a combined spec (`pnpm api:bundle`)
3. TypeScript types and operation helpers are generated (`pnpm api:types`)

To regenerate types after modifying OpenAPI specs:

```bash
pnpm run api:build
```

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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Documentation](https://docs.messari.io)
- [API Reference](https://docs.messari.io/api)
- [GitHub Issues](https://github.com/messari/messari-kit/issues) 