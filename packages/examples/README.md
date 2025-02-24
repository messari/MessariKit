# Messari Kit Examples

This package contains examples demonstrating how to use the Messari Kit API client.

## Available Examples

### Chat Completion

The `chatCompletion.ts` example demonstrates how to use the MessariClient to call the createChatCompletion endpoint.

```typescript
// Import the MessariClient and types
import { MessariClient } from "@messari-kit/api";
import { createChatCompletionParameters } from "@messari-kit/types";

// Initialize the client with your API key
const client = new MessariClient({
  apiKey: "your-api-key-here",
});

// Call the createChatCompletion endpoint
const response = await client.ai.createChatCompletion({
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: "What is Ethereum?",
    },
  ],
});
```

## Running the Examples

To run the examples, first build the packages:

```bash
pnpm build
```

Then run the specific example:

```bash
pnpm -F @messari-kit/examples start
```

## API Key

Replace the stubbed API key in the examples with your actual Messari API key when running the examples. 