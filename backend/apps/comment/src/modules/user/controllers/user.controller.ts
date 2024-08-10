import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { pb } from '@app/shared';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class UserController {
  constructor(
    @InjectPinoLogger(UserController.name)
    private readonly logger: PinoLogger,
    private readonly userService: UserService,
  ) {}

  @EventPattern('UserCreated')
  handleUserCreated(data: pb.UserCreated) {
    this.logger.info({ data }, 'handleUserCreated');
    this.userService.userCreated({ userCreated: data });
  }
}
