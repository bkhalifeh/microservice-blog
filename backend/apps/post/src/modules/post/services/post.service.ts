import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  TCreateInput,
  TFindInput,
  TFindOneInput,
} from '../types/post.service.type';
import {
  DrizzleService,
  Sort,
  TId,
  TSlug,
  UserNotExistException,
} from '@app/shared';
import * as schema from '../../../../db/schema';
import slugify from 'slugify';
import { asc, desc, eq } from 'drizzle-orm';
import { PgColumn, PgSelectBase } from 'drizzle-orm/pg-core';
import { OrderBy } from '../enums/order-by.enum';
import { UserService } from '../../user/services/user.service';
import { ExistTitleException } from '../exceptions/exist-title.exception';
import { is, tags } from 'typia';

@Injectable()
export class PostService {
  public static readonly DEFAULT_POST_PER_PAGE = 10;

  constructor(
    private readonly drizzleService: DrizzleService<typeof schema>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(args: TCreateInput) {
    return this.drizzleService.db.transaction(async (tx) => {
      const user = await this.userService.findOne({ id: args.userId, tx });
      if (!user) {
        throw UserNotExistException.getInstance();
      }
      const slug = slugify(args.createPostDto.title);
      const post = (
        await tx
          .select({
            slug: schema.posts.slug,
          })
          .from(schema.posts)
          .where(eq(schema.posts.slug, slug))
          .limit(1)
      ).pop();
      if (post) {
        throw ExistTitleException.getInstance();
      }
      return (
        await tx
          .insert(schema.posts)
          .values({
            title: args.createPostDto.title,
            content: args.createPostDto.content,
            authorId: user.id,
            slug,
          })
          .returning()
      ).pop();
    });
  }

  find(args: TFindInput) {
    let query: any = this.drizzleService.db
      .select({
        id: schema.posts.id,
        title: schema.posts.title,
        slug: schema.posts.slug,
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
        slug: schema.posts.slug,
        content: schema.posts.content,
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
          slug: schema.posts.slug,
          content: schema.posts.content,
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
}
