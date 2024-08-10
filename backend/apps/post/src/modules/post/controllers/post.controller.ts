import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { CreatePostDto } from '../dtos/create-post.dto';
import { IsUserAuthenticatedGuard } from '@app/shared/modules/authentication';
import { TId, TSlug } from '@app/shared';
import { number } from 'joi';
import { TIdOrSlug } from '../types/validator.type';
import { tags } from 'typia';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('post')
export class PostController {
  constructor(
    @InjectPinoLogger(PostController.name)
    private readonly logger: PinoLogger,
    private readonly postService: PostService,
  ) {}

  @UseGuards(IsUserAuthenticatedGuard)
  @TypedRoute.Post()
  createPost(@Req() req: any, @TypedBody() createPostDto: CreatePostDto) {
    this.logger.info(
      { data: { user: req.user, data: createPostDto } },
      'createPost',
    );
    return this.postService.create({ userId: req.user.userId, createPostDto });
  }

  @TypedRoute.Get()
  listPosts() {
    this.logger.info('listPosts');
    return this.postService.find({});
  }

  @TypedRoute.Get(':postId')
  detailPost(@TypedParam('postId') postId: TId) {
    this.logger.info({ data: postId }, 'detailPost');
    return this.postService.findOne({ id: postId });
  }
}
