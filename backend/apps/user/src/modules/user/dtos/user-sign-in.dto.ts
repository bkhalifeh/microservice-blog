import { TEmail, TStrongPassword } from '../types/validators.type';

export class UserSignInDto {
  email!: TEmail;
  password!: TStrongPassword;
}
