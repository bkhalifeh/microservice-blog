import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';

export type TAppInitOutput = Promise<{
  app: NestFastifyApplication<any>;
  logger: Logger;
  configService: ConfigService;
}>;
