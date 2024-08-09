import { CLIENT_NATS, DrizzleService, pb } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import * as schema from '../../../../db/schema';

@Injectable()
export class UserService {
  constructor(
    @Inject(CLIENT_NATS)
    private readonly client: ClientNats,
    private readonly drizzleService: DrizzleService<typeof schema>,
  ) {}

  create() {
    this.client
      .emit<
        any,
        pb.UserCreated
      >('UserCreated', { id: 1, fullName: 'behzad khalifeh' })
      .subscribe();
    return {};
  }
}
