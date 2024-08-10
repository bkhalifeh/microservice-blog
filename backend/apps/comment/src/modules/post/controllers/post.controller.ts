import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PostService } from '../services/post.service';
import { pb } from '@app/shared';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class PostController {
  constructor(
    @InjectPinoLogger(PostController.name)
    private readonly logger: PinoLogger,
    private readonly postService: PostService,
  ) {}

  @EventPattern('PostCreated')
  handlePostCreated(data: pb.PostCreated) {
    this.logger.info({ data }, 'handlePostCreated');
    this.postService.postCreated({ postCreated: data });
  }
}
