import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @InjectPinoLogger(RedisService.name)
    private readonly logger: PinoLogger,
    @Inject('REDIS_NAME')
    redisName: string,
    configService: ConfigService,
  ) {
    super(configService.get<string>(`REDIS_URL_${redisName}`, ''), {
      lazyConnect: true,
    });
  }
  onModuleDestroy() {
    this.logger.info('Disconnect from redis');
    this.disconnect();
  }

  onModuleInit() {
    this.connect((err) => {
      if (err) {
        throw err;
      }
    });
  }
}
