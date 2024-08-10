import { CLIENT_NATS, DrizzleService, pb } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { ClientNats } from '@nestjs/microservices';
import * as schema from '../../../../db/schema';
import {
  TGetTokenInput,
  TSignInInput,
  TSignUpInput,
  TSignUpOutput,
  TUserInsertResult,
} from '../types/user.service.type';
import { ExistEmailException } from '../exceptions/exist-email.exception';
import { HashService } from '../../hash/services/hash.service';
import { JwtService } from '@nestjs/jwt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserService {
  constructor(
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
    @Inject(CLIENT_NATS)
    private readonly client: ClientNats,
    private readonly drizzleService: DrizzleService<typeof schema>,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
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
        this.logger.info({ userFetched: user }, 'signUp :: transaction');
        if (user) {
          //tx.rollback();
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
      .subscribe(() => {
        this.logger.info({ data: userCreated }, 'signUp :: emit');
      });
    return userCreated;
  }

  async signIn(args: TSignInInput) {
    const user = (
      await this.drizzleService.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, args.userSignInDto.email))
        .limit(1)
    ).pop();
    if (
      user &&
      (await this.hashService.verify(
        user.password,
        args.userSignInDto.password,
      ))
    ) {
      return user;
    }
    return undefined;
  }

  async getToken(args: TGetTokenInput) {
    return {
      accessToken: this.jwtService.sign({
        sub: args.id,
        email: args.email,
      }),
    };
  }
}
