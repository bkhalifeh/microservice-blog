import { Controller, Req, UseGuards } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { UserService } from '../services/user.service';
import { UserSignUpDto } from '../dtos/user-sign-up.dto';
import { PassportLocalGuard } from '../guards/passport-local.guard';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  constructor(
    @InjectPinoLogger(UserController.name)
    private readonly logger: PinoLogger,
    private readonly userService: UserService,
  ) {}

  @TypedRoute.Post('sign-up')
  async handleSignUpPost(@TypedBody() userSignUpDto: UserSignUpDto) {
    this.logger.info({ body: userSignUpDto }, 'sign-up');
    const { id, email } = await this.userService.signUp({ userSignUpDto });
    return this.userService.getToken({ id, email });
  }

  @UseGuards(PassportLocalGuard)
  @TypedRoute.Post('sign-in')
  handleSignInPost(@Req() req) {
    const { id, email } = req.user as { id: number; email: string };
    return this.userService.getToken({ id, email });
  }
}
