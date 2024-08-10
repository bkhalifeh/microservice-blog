import { Inject, Injectable } from '@nestjs/common';
import {
  TCreateInput,
  TFindInput,
  TInsertCommentResult,
} from '../types/comment.service.type';
import {
  CLIENT_NATS,
  DrizzleService,
  pb,
  PostNotFoundException,
  UserNotExistException,
} from '@app/shared';
import * as schema from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ClientNats } from '@nestjs/microservices';

@Injectable()
export class CommentService {
  constructor(
    @InjectPinoLogger(CommentService.name)
    private readonly logger: PinoLogger,
    @Inject(CLIENT_NATS)
    private readonly client: ClientNats,
    private readonly drizzleService: DrizzleService<typeof schema>,
  ) {}

  async create(args: TCreateInput) {
    const { content, ...commentCreated }: TInsertCommentResult =
      await this.drizzleService.db.transaction(async (tx) => {
        const user = (
          await tx
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, args.userId))
            .limit(1)
        ).pop();
        if (!user) {
          throw UserNotExistException.getInstance();
        }
        const post = (
          await tx
            .select()
            .from(schema.posts)
            .where(eq(schema.posts.id, args.postId))
            .limit(1)
        ).pop();
        if (!post) {
          throw PostNotFoundException.getInstance();
        }

        return (
          await tx
            .insert(schema.comments)
            .values({
              authorId: args.userId,
              postId: args.postId,
              content: args.createCommentDto.content,
            })
            .returning()
        ).pop() as TInsertCommentResult;
      });
    this.client
      .emit<any, pb.CommentCreated>('CommentCreated', commentCreated)
      .subscribe(() => {
        this.logger.info({ data: commentCreated }, 'create :: emit');
      });
    return commentCreated;
  }

  async find(args: TFindInput) {
    console.log(args);
    return this.drizzleService.db
      .select({
        id: schema.comments.id,
        content: schema.comments.content,
        author: {
          id: schema.users.id,
          fullName: schema.users.fullName,
        },
      })
      .from(schema.comments)
      .where(eq(schema.comments.postId, args.postId))
      .innerJoin(schema.users, eq(schema.users.id, schema.comments.authorId))
      .innerJoin(schema.posts, eq(schema.posts.id, schema.comments.postId))
      .execute();
  }
}
