import type { ZodError } from "zod";

/**
 * Structured validation error for environment variables
 */
export interface EnvError {
  readonly variable: string;
  readonly message: string;
  readonly code: string;
}

/**
 * Environment validation error with formatted output
 */
export class EnvValidationError extends Error {
  readonly context: "Server" | "Client";
  readonly errors: ReadonlyArray<EnvError>;

  constructor(context: "Server" | "Client", zodError: ZodError) {
    const errors = zodError.issues.map((issue) => ({
      variable: issue.path.join(".") || "unknown",
      message: issue.message,
      code: issue.code,
    }));

    // Create a clean, readable message for the error overlay
    const missingVars = errors.map((e) => e.variable).join(", ");
    const message = `Missing ${context.toLowerCase()} environment variables: ${missingVars}`;

    super(message);

    this.name = "EnvValidationError";
    this.context = context;
    this.errors = errors;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnvValidationError);
    }
  }

  /**
   * Get formatted error message for console output
   */
  getFormattedMessage(): string {
    const divider = "─".repeat(60);
    const lines = [
      "",
      `❌ ${this.context} Environment Validation Failed`,
      divider,
      "",
      "Missing or invalid environment variables:",
      "",
    ];

    for (const { variable, message } of this.errors) {
      lines.push(`  ✗ ${variable}`);
      lines.push(`    └─ ${message}`);
      lines.push("");
    }

    lines.push(divider);
    lines.push("");
    lines.push("💡 Create a .env.local file with the required variables.");
    lines.push("");

    return lines.join("\n");
  }

  /**
   * Get a simple list of missing variables
   */
  getMissingVariables(): string[] {
    return this.errors.map((e) => e.variable);
  }

  /**
   * Get errors as JSON for programmatic access
   */
  toJSON() {
    return {
      name: this.name,
      context: this.context,
      message: this.message,
      errors: this.errors,
    };
  }
}
