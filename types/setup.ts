import { type setups, type user } from '@/lib/db/schema';

/**
 * Setup with associated user information.
 * Used when displaying setups with their owner's profile data.
 */
export interface SetupWithUser {
  /** Setup data from the setups table */
  setups: typeof setups.$inferSelect;
  /** User data from the user table */
  user: typeof user.$inferSelect;
  /** Star metadata - included when fetching setups for display */
  starData?: {
    /** Whether the current user has starred this setup */
    isStarred: boolean;
    /** Total number of stars this setup has received */
    starCount: number;
  };
}

/**
 * Setup content stored as JSONB in the database.
 * Contains all the IDE configuration data synced from the extension.
 */
export interface SetupContent {
  /** Current color theme name */
  theme?: string;
  /** Editor font family */
  fontFamily?: string;
  /** Editor font size in pixels */
  fontSize?: number;
  /** List of installed extensions */
  extensions?:
    | {
        /** Extension unique identifier (publisher.name) */
        id: string;
        /** Display name of the extension */
        name: string;
        /** Current version */
        version?: string;
        /** Publisher/author name */
        publisher?: string;
        /** Brief description */
        description?: string;
      }[]
    | null
    | undefined;
  /** Editor and workbench settings */
  settings?: Record<string, unknown>;
}
