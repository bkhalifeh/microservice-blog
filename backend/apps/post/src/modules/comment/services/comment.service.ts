import { Injectable } from '@nestjs/common';
import { PostService } from '../../post/services/post.service';
import { TCommentCreatedInput } from '../types/comment.service.type';

@Injectable()
export class CommentService {
  constructor(private readonly postService: PostService) {}
  commentCreated(args: TCommentCreatedInput) {
    this.postService.incrementCommentCount(args.commentCreated.postId);
  }
}
