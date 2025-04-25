import type { Agent } from "node:http";
import type { LogLevel, Logger } from "../logging";
import type { APIResponseWithMetadata } from "../types";

/**
 * Options for configuring the MessariClient
 */
export type MessariClientOptions = {
  /** Required API key for authenticating with the Messari API */
  apiKey: string;
  /** Base URL for the API (defaults to https://api.messari.io) */
  baseUrl?: string;
  /** Timeout in milliseconds for API requests (defaults to 60000) */
  timeoutMs?: number;
  /** Custom fetch implementation (defaults to global fetch) */
  fetch?: typeof fetch;
  /** Node.js HTTP(S) Agent for connection pooling */
  agent?: Agent;
  /** Minimum log level to display (defaults to INFO) */
  logLevel?: LogLevel;
  /** Custom logger implementation */
  logger?: Logger;
  /** Set to true to completely disable all logging (overrides logLevel and logger) */
  disableLogging?: boolean;
  /** Default headers to include with all requests */
  defaultHeaders?: Record<string, string>;
  /** Event handler for error events */
  onError?: (data: ClientEventMap["error"]) => void;
  /** Event handler for request events */
  onRequest?: (data: ClientEventMap["request"]) => void;
  /** Event handler for response events */
  onResponse?: (data: ClientEventMap["response"]) => void;
};

/**
 * Request types
 */
export type RequestOptions = Omit<RequestInit, "headers" | "body"> & {
  timeoutMs?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export type RequestParameters = {
  method: string;
  path: string;
  body?: unknown;
  queryParams?: Record<string, unknown>;
  options?: RequestOptions;
};

/**
 * Pagination types
 */
export type PaginationParameters = {
  limit?: number;
  page?: number;
};

export type PaginationMetadata = {
  page: number;
  limit: number;
  totalRows?: number;
  totalPages?: number;
};

export type PaginatedResponse<T> = APIResponseWithMetadata<T, PaginationMetadata>;

export type PaginatedResult<T, P extends PaginationParameters> = {
  data: T;
  metadata?: PaginationMetadata;
  error?: string;
} & PaginationHelpers<T, P>;

export type PaginationHelpers<T, P extends PaginationParameters> = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => Promise<PaginatedResult<T, P>>;
  previousPage: () => Promise<PaginatedResult<T, P>>;
  goToPage: (page: number) => Promise<PaginatedResult<T, P>>;
  getAllPages: () => Promise<T[]>;
};

/**
 * Client Event Types
 */
export type ClientErrorEvent = {
  error: Error;
  request?: {
    method: string;
    path: string;
    queryParams?: Record<string, unknown>;
  };
};

export type ClientRequestEvent = {
  method: string;
  path: string;
  queryParams?: Record<string, unknown>;
};

export type ClientResponseEvent = {
  method: string;
  path: string;
  status: number;
  data: unknown;
};

export type ClientEventMap = {
  error: ClientErrorEvent;
  request: ClientRequestEvent;
  response: ClientResponseEvent;
};

export type ClientEventType = "error" | "request" | "response";

export type ClientEventHandler<T extends ClientEventType> = (data: ClientEventMap[T]) => void;
