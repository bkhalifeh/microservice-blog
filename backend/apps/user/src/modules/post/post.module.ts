import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';

@Module({
  imports: [UserModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
