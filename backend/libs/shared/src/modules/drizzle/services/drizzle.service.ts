import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import postgres from 'postgres';
import { DrizzleLogger } from '../provider/drizzle-logger.provider';

@Injectable()
export class DrizzleService<T extends Record<string, unknown>>
  implements OnModuleInit, OnModuleDestroy
{
  public db!: PostgresJsDatabase<T>;
  public client!: postgres.Sql<{}>;

  constructor(
    @Inject('DB_NAME') private readonly dbName: string,
    @Inject('SCHEMA') public readonly schema: T,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.client = postgres(
      String(
        this.configService.get<string>(
          `DATABASE_URL_${this.dbName.toUpperCase()}`,
        ),
      ),
      {
        max: 1,
        debug: true,
      },
    );
    this.db = drizzle(this.client, {
      schema: this.schema,
      logger: true,
    });
  }

  onModuleDestroy() {
    this.client.end();
  }
}
