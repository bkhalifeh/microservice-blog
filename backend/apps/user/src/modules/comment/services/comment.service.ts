import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { TCommentCreatedInput } from '../types/comment.service.type';

@Injectable()
export class CommentService {
  constructor(private readonly userService: UserService) {}

  commentCreated(args: TCommentCreatedInput) {
    this.userService.incrementCommentCount(args.userId);
  }
}
