import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { TId } from '@app/shared';
import { IsUserAuthenticatedGuard } from '@app/shared/modules/authentication';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class CommentController {
  constructor(
    @InjectPinoLogger(CommentController.name)
    private readonly logger: PinoLogger,
    private readonly commentService: CommentService,
  ) {}

  @UseGuards(IsUserAuthenticatedGuard)
  @TypedRoute.Post('post/:postId/comment')
  createComment(
    @Req() req,
    @TypedParam('postId') postId: TId,
    @TypedBody() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create({
      createCommentDto,
      postId,
      userId: req.user.userId,
    });
  }

  @TypedRoute.Get('post/:postId/comment')
  listComments(@TypedParam('postId') postId: TId) {
    return this.commentService.find({ postId });
  }
}
