import {
  CommonModule,
  DrizzleModule,
  NatsModule,
  RedisModule,
  RedisService,
} from '@app/shared';
import { Module } from '@nestjs/common';
import Joi from 'joi';
import * as schema from '../db/schema';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { PassportJwtStrategyProvider } from '@app/shared/modules/authentication/providers/passport-jwt-strategy.provider';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    CommonModule.forRoot({
      configValidation: Joi.object({
        DATABASE_URL_POST: Joi.string().uri().required(),
        REDIS_URL_POST: Joi.string().uri().required(),
        NATS_SERVER: Joi.string().uri().required(),
      }),
    }),
    NatsModule,
    RedisModule.forRoot('post'),
    DrizzleModule.forRoot('post', schema),
    PassportModule.register({ session: false }),
    PostModule,
    UserModule,
    CommentModule,
  ],
  providers: [PassportJwtStrategyProvider],
})
export class PostMicroServiceModule {}
