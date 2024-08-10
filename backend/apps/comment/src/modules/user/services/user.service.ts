import { CLIENT_NATS, DrizzleService } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as schema from '../../../../db/schema';
import { TUserCreatedInput } from '../types/user.service.type';
@Injectable()
export class UserService {
  constructor(
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
    @Inject(CLIENT_NATS)
    private readonly client: ClientNats,
    private readonly drizzleService: DrizzleService<typeof schema>,
  ) {}

  userCreated(args: TUserCreatedInput) {
    this.drizzleService.db
      .insert(schema.users)
      .values({
        id: args.userCreated.id,
        fullName: args.userCreated.fullName,
      })
      .execute();
  }
}
