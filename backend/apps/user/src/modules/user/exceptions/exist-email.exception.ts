import {
  HttpCode,
  HttpException,
  HttpStatus,
  NotAcceptableException,
} from '@nestjs/common';

export class ExistEmailException extends HttpException {
  private static instance: ExistEmailException;
  private constructor() {
    super(
      'A user with this email already exists. Please choose another email.',
      HttpStatus.CONFLICT,
    );
  }
  public static getInstance(): ExistEmailException {
    if (!ExistEmailException.instance) {
      ExistEmailException.instance = new ExistEmailException();
    }
    return ExistEmailException.instance;
  }
}
