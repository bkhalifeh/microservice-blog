import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  TCreateInput,
  TFetchUserPostsInput,
  TFindOneInput,
} from '../types/user.service.type';
import { DrizzleService } from '@app/shared';
import * as schema from '../../../../db/schema';
import { and, eq } from 'drizzle-orm';
import { PostService } from '../../post/services/post.service';

@Injectable()
export class UserService {
  constructor(
    private readonly drizzleService: DrizzleService<typeof schema>,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  create(args: TCreateInput) {
    const { email, ...insertNewUser } = args.userCreated;
    this.drizzleService.db.insert(schema.users).values(insertNewUser).execute();
  }

  async fetchUserPosts({ userId }: TFetchUserPostsInput) {
    return this.postService.findByUser(userId);
  }

  async findOne(args: TFindOneInput) {
    return (
      await (args.tx ? args.tx : this.drizzleService.db)
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, args.id))
        .limit(1)
    ).pop();
  }
}
