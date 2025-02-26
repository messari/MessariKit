import { assertNever } from "./utils";

export enum LogLevel {
  NONE = "none",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface Logger {
  (level: LogLevel, message: string, extraInfo?: Record<string, unknown>): void;
}

export function makeConsoleLogger(name: string): Logger {
  return (level, message, extraInfo) => {
    if (level === LogLevel.NONE) {
      // Do nothing for NONE log level
      return;
    }
    console[level](`${name} ${level}:`, message, extraInfo || "");
  };
}

/**
 * Transforms a log level into a comparable (numerical) value ordered by severity.
 */
export function logLevelSeverity(level: LogLevel): number {
  switch (level) {
    case LogLevel.NONE:
      return 100;
    case LogLevel.DEBUG:
      return 20;
    case LogLevel.INFO:
      return 40;
    case LogLevel.WARN:
      return 60;
    case LogLevel.ERROR:
      return 80;
    default:
      return assertNever(level);
  }
}

/**
 * Creates a logger that only logs messages with a severity greater than or equal to the specified level.
 */
export function createFilteredLogger(
  logger: Logger,
  minLevel: LogLevel
): Logger {
  const minSeverity = logLevelSeverity(minLevel);
  return (level, message, extraInfo) => {
    if (logLevelSeverity(level) >= minSeverity) {
      logger(level, message, extraInfo);
    }
  };
}

/**
 * Creates a logger that does nothing (no-op).
 * Use this when you want to completely disable logging.
 */
export function makeNoOpLogger(): Logger {
  return () => {
    // Do nothing
  };
}
