import { CLIENT_NATS, DrizzleService, pb } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { ClientNats } from '@nestjs/microservices';
import * as schema from '../../../../db/schema';
import {
  TSignInInput,
  TSignUpInput,
  TSignUpOutput,
  TUserInsertResult,
} from '../types/user.service.type';
import { ExistEmailException } from '../exceptions/exist-email.exception';
import { HashService } from '../../hash/services/hash.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(CLIENT_NATS)
    private readonly client: ClientNats,
    private readonly drizzleService: DrizzleService<typeof schema>,
    private readonly hashService: HashService,
  ) {}

  async signUp(args: TSignUpInput): TSignUpOutput {
    const { password, ...userCreated }: TUserInsertResult =
      await this.drizzleService.db.transaction(async (tx) => {
        const user = (
          await tx
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, args.userSignUpDto.email))
            .limit(1)
        ).pop();
        if (user) {
          tx.rollback();
          throw ExistEmailException.getInstance();
        }
        return (
          await tx
            .insert(schema.users)
            .values({
              email: args.userSignUpDto.email,
              fullName: args.userSignUpDto.fullName,
              password: await this.hashService.hash(
                args.userSignUpDto.password,
              ),
            })
            .returning()
        ).pop() as TUserInsertResult;
      });
    this.client
      .emit<any, pb.UserCreated>('UserCreated', userCreated)
      .subscribe();
    return userCreated;
  }

  signIn(args: TSignInInput) {}
}
