import { relations } from 'drizzle-orm';
import { index, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';
import { setups } from './setup-schema';

/**
 * Setup Stars - tracks which users have starred which setups.
 * Uses a composite primary key (userId + setupId) to ensure uniqueness.
 */
export const setupStars = pgTable(
  'setup_stars',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    setupId: text('setup_id')
      .notNull()
      .references(() => setups.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.setupId] }),
    index('setup_stars_setup_id_idx').on(table.setupId),
    index('setup_stars_user_id_idx').on(table.userId),
  ],
);

/**
 * Setup Stars Relations
 */
export const setupStarsRelations = relations(setupStars, ({ one }) => ({
  user: one(user, {
    fields: [setupStars.userId],
    references: [user.id],
  }),
  setup: one(setups, {
    fields: [setupStars.setupId],
    references: [setups.id],
  }),
}));
