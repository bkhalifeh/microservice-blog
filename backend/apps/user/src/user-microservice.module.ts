import {
  CommonModule,
  DrizzleModule,
  NatsModule,
  RedisModule,
  RedisService,
} from '@app/shared';
import { Module } from '@nestjs/common';
import Joi from 'joi';
import { HashModule } from './modules/hash/hash.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as schema from '../db/schema';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

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
    UserModule,
    PostModule,
    CommentModule,
  ],
})
export class UserMicroServiceModule {}
