import { drizzle } from 'drizzle-orm/neon-http';

import { serverEnv } from '@/lib/env';

import * as schema from './schema';

const db = drizzle(serverEnv.DATABASE_URL, {
  schema,
});

export { db };
