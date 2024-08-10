import { tags } from 'typia';

export type TEmail = string & tags.Format<'email'>;

export type TStrongPassword = string &
  tags.Pattern<'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'>;

export type TFullName = string &
  tags.Pattern<"^(?=.{2,64}$)[A-Za-z]+([ '-][A-Za-z]+)*$">;
