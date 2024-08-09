import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {
  CommonModule,
  DrizzleModule,
  NatsModule,
  RedisModule,
  RedisService,
} from '@app/shared';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import * as schema from '../../../db/schema';
import { HashModule } from '../hash/hash.module';
import Joi from 'joi';

@Module({
  imports: [
    CommonModule.forRoot({
      configValidation: Joi.object({
        DATABASE_URL_USER: Joi.string().uri().required(),
        REDIS_URL_USER: Joi.string().uri().required(),
        NATS_SERVER: Joi.string().uri().required(),
        ARGON_SECRET: Joi.string().min(8).required(),
      }),
    }),
    HashModule,
    NatsModule,
    RedisModule.forRoot('user'),
    DrizzleModule.forRoot('user', schema),
    BullModule.forRootAsync({
      inject: [RedisService],
      useFactory: (redisService: RedisService) => {
        return {
          connection: redisService,
        };
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
