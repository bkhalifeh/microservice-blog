import { tags } from 'typia';

export class UserSignInDto {
  email!: string & tags.Format<'email'>;
  password!: string;
}
