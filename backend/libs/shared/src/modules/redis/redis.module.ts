import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';

@Module({})
export class RedisModule {
  public static forRoot(name: string): DynamicModule {
    return {
      global: true,
      module: RedisModule,
      providers: [
        {
          useValue: name.toUpperCase(),
          provide: 'CACHE_NAME',
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
