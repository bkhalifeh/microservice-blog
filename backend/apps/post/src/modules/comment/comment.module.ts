import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
