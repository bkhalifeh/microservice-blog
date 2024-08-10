import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { pb } from '@app/shared';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { TypedParam, TypedRoute } from '@nestia/core';
import { tags } from 'typia';

@Controller('user')
export class UserController {
  constructor(
    @InjectPinoLogger(UserController.name)
    private readonly logger: PinoLogger,
    private readonly userService: UserService,
  ) {}

  @TypedRoute.Get(':userId/post')
  userPosts(@TypedParam('userId') userId: number & tags.Minimum<1>) {
    this.logger.info({ userId }, 'userPosts');
    return this.userService.fetchUserPosts({ userId });
  }

  @EventPattern('UserCreated')
  handleUserCreated(data: pb.UserCreated) {
    this.logger.info({ data }, 'handleUserCreated');
    this.userService.create({ userCreated: data });
  }
}
