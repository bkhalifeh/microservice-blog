import { NotAcceptableException } from '@nestjs/common';

export class ExistTitleException extends NotAcceptableException {
  private static instance: ExistTitleException;
  public static getInstance(): ExistTitleException {
    if (!ExistTitleException.instance) {
      ExistTitleException.instance = new ExistTitleException();
    }
    return ExistTitleException.instance;
  }
  constructor() {
    super(
      'The title you have entered already exists. Please choose a different title.',
    );
  }
}
