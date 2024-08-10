import { Module } from '@nestjs/common';
import { CommentModule } from './modules/comment/comment.module';
import {
  CommonModule,
  DrizzleModule,
  NatsModule,
  RedisModule,
} from '@app/shared';
import Joi from 'joi';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import * as schema from '../db/schema';

@Module({
  imports: [
    CommonModule.forRoot({
      configValidation: Joi.object({
        DATABASE_URL_COMMENT: Joi.string().uri().required(),
        REDIS_URL_COMMENT: Joi.string().uri().required(),
        NATS_SERVER: Joi.string().uri().required(),
      }),
    }),
    NatsModule,
    RedisModule.forRoot('comment'),
    DrizzleModule.forRoot('comment', schema),
    PassportModule.register({ session: false }),
    PostModule,
    UserModule,
    CommentModule,
  ],
})
export class CommentMicroServiceModule {}
