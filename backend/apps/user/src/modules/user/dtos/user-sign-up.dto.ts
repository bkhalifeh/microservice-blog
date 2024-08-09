import { tags } from 'typia';

export class UserSignUpDto {
  fullName!: string & tags.MinLength<3> & tags.MaxLength<64>;
  email!: string & tags.Format<'email'>;
  password!: string;
}
