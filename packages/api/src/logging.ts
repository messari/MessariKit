import { assertNever } from "./utils";

/**
 * The severity level of a log message.
 */
export enum LogLevel {
  NONE = "none",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * A function that logs a message with a given severity level.
 */
export type Logger = (level: LogLevel, message: string, extraInfo?: Record<string, unknown>) => void;

/**
 * Creates a logger that logs messages to the console.
 * @param name - The name of the logger.
 * @returns A logger function.
 */
export const makeConsoleLogger = (name: string): Logger => {
  return (level, message, extraInfo) => {
    if (level === LogLevel.NONE) {
      return;
    }
    console[level](`${name} ${level}:`, message, extraInfo || "");
  };
};

/**
 * Transforms a log level into a comparable (numerical) value ordered by severity.
 * @param level - The log level to transform.
 * @returns A numerical value representing the severity of the log level.
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
 * @param logger - The logger to filter.
 * @param minLevel - The minimum log level to log.
 * @returns A filtered logger.
 */
export const createFilteredLogger = (logger: Logger, minLevel: LogLevel): Logger => {
  const minSeverity = logLevelSeverity(minLevel);
  return (level, message, extraInfo) => {
    if (logLevelSeverity(level) >= minSeverity) {
      logger(level, message, extraInfo);
    }
  };
};

/**
 * Creates a logger that does nothing (no-op).
 * Use this when you want to completely disable logging.
 * @returns A no-op logger.
 */
export const makeNoOpLogger: Logger = () => {};
