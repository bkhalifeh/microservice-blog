import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NatsOptions } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { getNatsOption } from '../modules/nats';
import { TAppInitOutput } from './types/functions.type';
import { BadRequestExceptionFilter } from './filters/bad-request.exception.filter';

export async function appInit(module: any): TAppInitOutput {
  const app = await NestFactory.create<NestFastifyApplication>(
    module,
    new FastifyAdapter({}),
    {
      bufferLogs: true,
    },
  );
  const logger = app.get(Logger);
  app.useLogger(logger);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalFilters(new BadRequestExceptionFilter());

  app.connectMicroservice<NatsOptions>(getNatsOption(configService));
  return { app, logger, configService };
}

export function createOnListen(logger: Logger) {
  return (err: Error, address: string) => {
    if (err) {
      logger.error('Can not start server');
      throw err;
    }
    logger.log(`🚀 HTTP server is running on: ${address}`);
  };
}
