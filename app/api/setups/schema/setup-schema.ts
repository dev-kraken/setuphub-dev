import * as z from "zod";

/**
 * Validation schema for creating/updating a setup
 *
 * Enforces:
 * - Required fields: name, editorName
 * - String length limits for performance and UX
 * - Optional fields with proper types
 */
export const createSetupSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters")
        .trim(),

    editorName: z
        .string()
        .min(1, "Editor name is required")
        .max(50, "Editor name must be less than 50 characters")
        .trim()
        .toLowerCase(),

    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .trim()
        .optional(),

    isPublic: z
        .boolean()
        .default(false),

    // Setup data (theme, extensions, settings, etc.)
    theme: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.number().positive().optional(),
    extensions: z.array(z.object({
        id: z.string(),
        name: z.string(),
        version: z.string().optional(),
    })).optional(),
    settings: z.record(z.string(), z.unknown()).optional(),
});


/**
 * Validation schema for editor name path parameter
 */
export const editorNameParamSchema = z.object({
    editorName: z
        .string()
        .min(1, "Editor name is required")
        .max(50, "Editor name must be less than 50 characters"),
});
