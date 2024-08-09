import { Controller } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { UserService } from '../services/user.service';
import { UserSignInDto } from '../dtos/user-sign-in.dto';
import { UserSignUpDto } from '../dtos/user-sign-up.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Post('sign-up')
  handleSignUpPost(@TypedBody() userSignUpDto: UserSignUpDto) {
    return this.userService.signUp({ userSignUpDto });
  }

  @TypedRoute.Post('sign-in')
  handleSignInPost(@TypedBody() userSignInDto: UserSignInDto) {}
}
