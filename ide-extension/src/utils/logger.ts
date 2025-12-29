/**
 * Logging utility for the extension
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Logger class for consistent logging
 */
export class Logger {
  private static instance: Logger;
  private currentLevel: LogLevel = LogLevel.INFO;
  private extensionName = 'SetupHub Sync';

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Format log message with timestamp
   */
  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.extensionName}] [${level}] ${message}`;
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.currentLevel <= LogLevel.DEBUG) {
      console.debug(this.format('DEBUG', message), ...args);
    }
  }

  /**
   * Log info message
   */
  info(message: string, ...args: unknown[]): void {
    if (this.currentLevel <= LogLevel.INFO) {
      console.log(this.format('INFO', message), ...args);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.currentLevel <= LogLevel.WARN) {
      console.warn(this.format('WARN', message), ...args);
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: unknown): void {
    if (this.currentLevel <= LogLevel.ERROR) {
      console.error(this.format('ERROR', message), error);
    }
  }
}

/**
 * Export singleton instance
 */
export const logger = Logger.getInstance();
