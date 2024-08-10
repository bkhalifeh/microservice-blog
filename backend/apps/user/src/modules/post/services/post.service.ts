import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { TPostCreatedInput } from '../types/post.service.type';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PostService {
  constructor(
    @InjectPinoLogger(PostService.name)
    private readonly logger: PinoLogger,
    private readonly userService: UserService,
  ) {}

  postCreated(args: TPostCreatedInput) {
    this.userService.incrementPostCount(args.userId);
  }
}
