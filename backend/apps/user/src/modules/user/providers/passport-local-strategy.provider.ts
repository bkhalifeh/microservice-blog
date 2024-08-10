import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { assert, is } from 'typia';
import { TEmail, TStrongPassword } from '../types/validators.type';

@Injectable()
export class PassportLocalStrategyProvider extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    });
  }

  async validate(email: string, password: string): Promise<any> {
    assert<TEmail>(email);
    assert<TStrongPassword>(password);
    return this.userService.signIn({
      userSignInDto: { email, password },
    });
  }
}
