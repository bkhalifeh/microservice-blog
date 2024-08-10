import { NotFoundException } from '@nestjs/common';

export class UserNotExistException extends NotFoundException {
  private static instance: UserNotExistException;
  public static getInstance(): UserNotExistException {
    if (!UserNotExistException.instance) {
      UserNotExistException.instance = new UserNotExistException();
    }
    return UserNotExistException.instance;
  }
  private constructor() {
    super('The specified user does not exist in our system.');
  }
}
