import { Logger } from 'drizzle-orm';
import { PinoLogger } from 'nestjs-pino';

export class DrizzleLogger implements Logger {
  constructor(private readonly logger: PinoLogger) {}

  logQuery(query: string, params: unknown[]): void {
    this.logger.info(query, ...params);
  }
}
