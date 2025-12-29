import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

/**
 * User Profile - Extended user information.
 * One-to-one relationship with user table.
 * Stores bio and social links (optional fields).
 */
export const userProfile = pgTable('user_profile', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  websiteUrl: text('website_url'),
  twitterUsername: text('twitter_username'),
  linkedinUrl: text('linkedin_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * User Profile Relations
 */
export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}));
