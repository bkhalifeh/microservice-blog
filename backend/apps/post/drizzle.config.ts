import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './apps/post/db/schema.ts',
  out: './apps/post/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: String(process.env.DATABASE_URL_POST),
  },
});
