import { UserSignInDto } from '../dtos/user-sign-in.dto';
import { UserSignUpDto } from '../dtos/user-sign-up.dto';

export type TSignUpInput = {
  userSignUpDto: UserSignUpDto;
};

export type TSignUpOutput = Promise<{
  id: number;
  fullName: string;
  email: string;
}>;

export type TSignInInput = {
  userSignInDto: UserSignInDto;
};

export type TUserInsertResult = {
  id: number;
  fullName: string;
  email: string;
  password: string;
};

export type TGetTokenInput = {
  id: number;
  email: string;
};

export type TFindOneInput = {
  userId: number;
};

export type TUserSelectResult = {
  id: number;
  fullName: string;
  email: string;
  password: string;
  postCount: number;
  commentCount: number;
};
