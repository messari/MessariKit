# Messari API Examples

This package contains examples of how to use the Messari API client.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Messari API key to the `.env` file:
     ```
     MESSARI_API_KEY=your_api_key_here
     ```

## Running Examples

### News Feed Example

This example demonstrates how to use the News API to fetch news articles, assets, and sources with pagination.

```bash
npx tsx src/newsFeed.ts
```

### Chat Completion Example

This example demonstrates how to use the AI API to create chat completions.

```bash
npx tsx src/chatCompletion.ts
```

## API Documentation

For more information about the Messari API, refer to the official documentation. 