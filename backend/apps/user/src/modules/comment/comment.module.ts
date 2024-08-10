import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
