import { pb } from '@app/shared';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import * as schema from '../../../../db/schema';
export type TCreateInput = {
  userCreated: pb.UserCreated;
};

export type TFetchUserPostsInput = {
  userId: number;
};

export type TFindOneInput = {
  id: number;
  tx?: PgTransaction<
    PostgresJsQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >;
};
