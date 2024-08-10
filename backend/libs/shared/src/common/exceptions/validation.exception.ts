import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(property: string) {
    super(`${property} must be an ${property}`);
  }
}
