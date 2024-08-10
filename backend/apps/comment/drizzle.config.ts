import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './apps/comment/db/schema.ts',
  out: './apps/comment/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: String(process.env.DATABASE_URL_COMMENT),
  },
});
