// This file is auto-generated. DO NOT EDIT
import { components } from './ai';


export type createChatCompletionResponse = components['schemas']['ChatCompletionResponse'];
export type createChatCompletionError = components['schemas']['APIError'];

export interface createChatCompletionParameters {
  body: components['schemas']['ChatCompletionRequest'];
  auth?: { apiKey: string };
}


export const createChatCompletion = {
  method: 'POST' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: ['messages', 'verbosity', 'response_format', 'stream'] as const,
  path: () => '/v1/chat/completions'
} as const;


export type extractEntitiesResponse = components['schemas']['ExtractResponse'];
export type extractEntitiesError = components['schemas']['APIError'];

export interface extractEntitiesParameters {
  body: components['schemas']['ExtractRequest'];
  auth?: { apiKey: string };
}


export const extractEntities = {
  method: 'POST' as const,
  pathParams: [] as const,
  queryParams: [] as const,
  bodyParams: ['content', 'entityTypes', 'allSimilarEntities'] as const,
  path: () => '/v1/classification/extraction'
} as const;
