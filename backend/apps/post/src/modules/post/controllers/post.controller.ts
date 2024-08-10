import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { CreatePostDto } from '../dtos/create-post.dto';
import { IsUserAuthenticatedGuard } from '@app/shared/modules/authentication';
import { TId, TSlug } from '@app/shared';
import { number } from 'joi';
import { TIdOrSlug } from '../types/validator.type';
import { tags } from 'typia';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(IsUserAuthenticatedGuard)
  @TypedRoute.Post()
  createPost(@Req() req: any, @TypedBody() createPostDto: CreatePostDto) {
    return this.postService.create({ userId: req.user.userId, createPostDto });
  }

  @TypedRoute.Get()
  listPosts() {
    return this.postService.find({});
  }

  @TypedRoute.Get(':postId')
  detailPost(@TypedParam('postId') postId: TId) {
    return this.postService.findOne({ id: postId });
  }
}
