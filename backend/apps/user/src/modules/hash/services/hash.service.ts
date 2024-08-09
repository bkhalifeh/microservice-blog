import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  private readonly secret: Buffer;
  constructor(configService: ConfigService) {
    this.secret = Buffer.from(
      String(configService.get<string>('ARGON_SECRET', '12345678')),
    );
  }

  hash(plainText: string): Promise<string> {
    return argon2.hash(plainText, {
      type: argon2.argon2i,
      secret: this.secret,
    });
  }

  verify(digest: string, plainText: string): Promise<boolean> {
    return argon2.verify(digest, plainText, { secret: this.secret });
  }
}
