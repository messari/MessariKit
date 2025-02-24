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
│           ├── ai.ts           # Generated API types
│           └── index.ts        # Generated operations
├── typegen/
│   ├── openapi/
│   │   ├── common/            # Shared OpenAPI components
│   │   ├── services/          # Service-specific OpenAPI specs
│   │   └── dist/             # Bundled OpenAPI specs
│   └── scripts/              # Type generation scripts
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

The SDK uses a two-step type generation process:

1. OpenAPI specs are bundled and validated
2. TypeScript types and operation helpers are generated

To regenerate types after modifying OpenAPI specs:

```bash
pnpm run api:build
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Documentation](https://docs.messari.io)
- [API Reference](https://docs.messari.io/api)
- [GitHub Issues](https://github.com/messari/messari-kit/issues) 