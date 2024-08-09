import { execSync } from 'child_process';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function bootstrap() {
  const listApps = ['user'];
  listApps.forEach(async (app) => {
    execSync(
      `pnpm exec drizzle-kit generate --config ./apps/${app}/drizzle.config.ts`,
    );
    const url = process.env[`DATABASE_URL_${app.toUpperCase()}`] as string;
    console.log(url);
    const client = postgres(url, { max: 1 });
    const schema = await import(`./apps/${app}/db/schema`);
    const db = drizzle(client, { schema });
    await migrate(db, {
      migrationsFolder: `./apps/${app}/db/migrations`,
      migrationsTable: 'migrations',
    });
    await client.end();
  });
}
bootstrap();
