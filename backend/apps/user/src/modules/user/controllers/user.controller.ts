import { Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { UserSignInDto } from '../dtos/user-sign-in.dto';
import { UserSignUpDto } from '../dtos/user-sign-up.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Post('sign-up')
  handleSignUpPost(@TypedBody() userSignUpDto: UserSignUpDto) {
    return this.userService.create();
  }

  @TypedRoute.Post('sign-in')
  handleSignInPost(@TypedBody() userSignInDto: UserSignInDto) {}
}
