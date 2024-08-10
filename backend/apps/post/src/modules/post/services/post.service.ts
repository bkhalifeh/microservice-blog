import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  TCreateInput,
  TFindInput,
  TFindOneInput,
  TPostInsertResult,
} from '../types/post.service.type';
import {
  CLIENT_NATS,
  DrizzleService,
  pb,
  Sort,
  TId,
  TSlug,
  UserNotExistException,
} from '@app/shared';
import * as schema from '../../../../db/schema';
import slugify from 'slugify';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { PgColumn, PgSelectBase } from 'drizzle-orm/pg-core';
import { OrderBy } from '../enums/order-by.enum';
import { UserService } from '../../user/services/user.service';
import { ExistTitleException } from '../exceptions/exist-title.exception';
import { is, tags } from 'typia';
import { ClientNats } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PostService {
  public static readonly DEFAULT_POST_PER_PAGE = 10;

  constructor(
    @InjectPinoLogger(PostService.name)
    private readonly logger: PinoLogger,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(CLIENT_NATS)
    private readonly client: ClientNats,
    private readonly drizzleService: DrizzleService<typeof schema>,
  ) {}

  async create(args: TCreateInput) {
    const { commentCount, content, ...postCreated }: TPostInsertResult =
      await this.drizzleService.db.transaction(async (tx) => {
        const user = await this.userService.findOne({ id: args.userId, tx });
        if (!user) {
          throw UserNotExistException.getInstance();
        }
        return (
          await tx
            .insert(schema.posts)
            .values({
              title: args.createPostDto.title,
              content: args.createPostDto.content,
              authorId: user.id,
            })
            .returning()
        ).pop() as TPostInsertResult;
      });
    this.client
      .emit<any, pb.PostCreated>('PostCreated', postCreated)
      .subscribe(() => {
        this.logger.info({ data: postCreated }, 'create :: emit');
      });
    return postCreated;
  }

  find(args: TFindInput) {
    let query: any = this.drizzleService.db
      .select({
        id: schema.posts.id,
        title: schema.posts.title,
        commentCount: schema.posts.commentCount,
        author: {
          id: schema.users.id,
          fullName: schema.users.fullName,
        },
      })
      .from(schema.posts);

    if (args.authorId) {
      query = query.where(eq(schema.posts.authorId, args.authorId));
    }

    if (args.order) {
      let orderByColumn: PgColumn;
      switch (args.order.by) {
        case OrderBy.TITLE: {
          orderByColumn = schema.posts.title;
          break;
        }
        default: {
          orderByColumn = schema.posts.id;
        }
      }
      query = query.orderBy(
        args.order.sort === Sort.ASC ? asc(orderByColumn) : desc(orderByColumn),
      );
    }

    if (args.perPage) {
      query = query.limit(args.perPage);
    } else {
      query = query.limit(PostService.DEFAULT_POST_PER_PAGE);
    }

    return query.innerJoin(
      schema.users,
      eq(schema.posts.authorId, schema.users.id),
    );
  }

  findByUser(userId: number) {
    return this.drizzleService.db
      .select({
        id: schema.posts.id,
        title: schema.posts.title,
        commentCount: schema.posts.commentCount,
      })
      .from(schema.posts)
      .where(eq(schema.posts.authorId, userId));
  }

  async findOne(args: TFindOneInput) {
    return (
      await this.drizzleService.db
        .select({
          id: schema.posts.id,
          title: schema.posts.title,
          content: schema.posts.content,
          commentCount: schema.posts.commentCount,
          author: {
            id: schema.users.id,
            fullName: schema.users.fullName,
          },
        })
        .from(schema.posts)
        .where(eq(schema.posts.id, args.id))
        .innerJoin(schema.users, eq(schema.posts.authorId, schema.users.id))
    ).pop();
  }

  incrementCommentCount(postId: number) {
    this.drizzleService.db
      .update(schema.posts)
      .set({
        commentCount: sql`${schema.posts.commentCount} + 1`,
      })
      .where(eq(schema.posts.id, postId))
      .execute();
  }
}
