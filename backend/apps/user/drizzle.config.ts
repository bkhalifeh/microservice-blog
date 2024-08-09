import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './apps/user/db/schema.ts',
  out: './apps/user/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: String(process.env.DATABASE_URL_USER),
  },
});
