import { Module } from '@nestjs/common';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { PassportJwtStrategyProvider } from '@app/shared/modules/authentication/providers/passport-jwt-strategy.provider';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ session: false })],
  controllers: [CommentController],
  providers: [CommentService, PassportJwtStrategyProvider],
})
export class CommentModule {}
