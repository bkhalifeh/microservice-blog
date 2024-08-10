import { Inject, Injectable } from '@nestjs/common';
import { TPostCreatedInput } from '../types/post.service.type';
import { CLIENT_NATS, DrizzleService } from '@app/shared';
import { ClientNats } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as schema from '../../../../db/schema';
@Injectable()
export class PostService {
  constructor(
    @InjectPinoLogger(PostService.name)
    private readonly logger: PinoLogger,
    @Inject(CLIENT_NATS)
    private readonly client: ClientNats,
    private readonly drizzleService: DrizzleService<typeof schema>,
  ) {}

  postCreated(args: TPostCreatedInput) {
    this.drizzleService.db
      .insert(schema.posts)
      .values({
        id: args.postCreated.id,
      })
      .execute();
  }
}
