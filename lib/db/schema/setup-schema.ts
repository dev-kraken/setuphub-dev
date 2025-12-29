import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, text, timestamp, unique, varchar } from 'drizzle-orm/pg-core';

import { type SetupContent } from '@/types/setup';

import { user } from './auth-schema';

/**
 * Setups - stores user IDE configurations.
 * Each user can have one setup per editor (vscode, cursor, etc.).
 */
export const setups = pgTable(
  'setups',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    editorName: varchar('editor_name', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    content: jsonb('content').$type<SetupContent>().notNull(),
    isPublic: boolean('is_public').default(false).notNull(),
    /**
     * Denormalized star count for performance.
     * Updated atomically when users star/unstar.
     * Avoids expensive COUNT queries on every page load.
     */
    starCount: integer('star_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [unique('setups_user_editor_unique').on(table.userId, table.editorName)],
);

/**
 * Personal Access Tokens - for extension authentication.
 * Users generate these tokens to authenticate from VS Code extension.
 */
export const personalAccessTokens = pgTable('personal_access_tokens', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  token: text('token').notNull().unique(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Personal Access Tokens Relations
 */
export const personalAccessTokensRelations = relations(personalAccessTokens, ({ one }) => ({
  user: one(user, {
    fields: [personalAccessTokens.userId],
    references: [user.id],
  }),
}));

/**
 * Setups Relations
 */
export const setupsRelations = relations(setups, ({ one }) => ({
  user: one(user, {
    fields: [setups.userId],
    references: [user.id],
  }),
}));
