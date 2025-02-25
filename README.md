# MessariKit

MessariKit is the official TypeScript/JavaScript SDK for interacting with Messari's APIs. It provides a type-safe, intuitive interface for accessing Messari's suite of crypto data and AI services.

## Features

- 🔒 **Type-safe**: Full TypeScript support with automatically generated types from OpenAPI specs
- 🚀 **Modern**: Built with modern TypeScript features and best practices
- 📚 **Well-documented**: Comprehensive documentation and examples
- 🔄 **Auto-generated**: API types and operations are automatically generated from OpenAPI specifications
- 🛠 **Developer-friendly**: Intuitive API design with built-in error handling

## Installation

```bash
# Using pnpm
pnpm add @messari-kit/api
```

## Quick Start

```typescript
import { MessariClient } from 'messari-kit';

// Initialize the client
const client = new MessariClient({
  apiKey: 'your-api-key'
});

// Use the AI service
const response = await client.ai.createChatCompletion({
  body: {
    messages: [
      { role: 'user', content: 'What is the latest news about Bitcoin?' }
    ]
  }
});

// Extract entities from text
const entities = await client.ai.extractEntities({
  body: {
    content: 'Ethereum founder Vitalik Buterin announced...',
    entityTypes: ['person', 'project']
  }
});
```

## API Services

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