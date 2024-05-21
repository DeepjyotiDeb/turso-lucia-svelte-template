import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sessionTable, userTable } from './turso-schema';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { TURSO_DB, TURSO_TOKEN } from '$env/static/private';

const turso = createClient({
  url: TURSO_DB,
  authToken: TURSO_TOKEN,
});

export const db = drizzle(turso);

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
