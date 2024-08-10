import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  private static instance: PostNotFoundException;
  public static getInstance(): PostNotFoundException {
    if (!PostNotFoundException.instance) {
      PostNotFoundException.instance = new PostNotFoundException();
    }
    return PostNotFoundException.instance;
  }
  constructor() {
    super('');
  }
}
