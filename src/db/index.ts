import { createClient } from '@libsql/client';
import * as schema from './schema/todo';
import { drizzle } from 'drizzle-orm/libsql';

export const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export const db = drizzle(client, {
  schema,
  logger: true,
});
