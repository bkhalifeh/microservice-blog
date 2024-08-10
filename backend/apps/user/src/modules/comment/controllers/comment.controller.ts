import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CommentService } from '../services/comment.service';
import { pb } from '@app/shared';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class CommentController {
  constructor(
    @InjectPinoLogger(CommentController.name)
    private readonly logger: PinoLogger,
    private readonly commentService: CommentService,
  ) {}

  @EventPattern('CommentCreated')
  handleCommentCreated(data: pb.CommentCreated) {
    this.logger.info({ data }, 'handleCommentCreated');
    return this.commentService.commentCreated({ userId: data.authorId });
  }
}
