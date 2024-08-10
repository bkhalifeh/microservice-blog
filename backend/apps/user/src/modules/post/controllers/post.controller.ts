import { Controller } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { EventPattern } from '@nestjs/microservices';
import { pb } from '@app/shared';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('post')
export class PostController {
  constructor(
    @InjectPinoLogger(PostController.name)
    private readonly logger: PinoLogger,
    private readonly postService: PostService,
  ) {}

  @EventPattern('PostCreated')
  handlePostCreated(data: pb.PostCreated) {
    this.logger.info({ data }, 'handlePostCreated');
    this.postService.postCreated({ userId: data.authorId });
  }
}
