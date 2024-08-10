import { TEmail, TFullName, TStrongPassword } from '../types/validators.type';

export class UserSignUpDto {
  fullName!: TFullName;
  email!: TEmail;
  password!: TStrongPassword;
}
