import {
  pgTable,
  varchar,
  char,
  serial,
  integer,
  text,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: integer('id').primaryKey(),
    fullName: varchar('full_name', { length: 64 }).notNull(),
  },
  (table) => {
    return {};
  },
);

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 128 }).notNull(),
    content: text('content').notNull(),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id),
    commentCount: integer('comment_count').notNull().default(0),
  },
  (table) => {
    return {
      authorIdx: index('author_idx').on(table.authorId),
    };
  },
);
