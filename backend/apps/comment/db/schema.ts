import {
  pgTable,
  varchar,
  serial,
  integer,
  text,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').primaryKey(),
  fullName: varchar('full_name', { length: 64 }).notNull(),
});

export const posts = pgTable('posts', {
  id: integer('id').primaryKey(),
});

export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id),
  },
  (table) => {
    return {
      authorIdx: index('author_idx').on(table.authorId),
      postIdx: index('post_idx').on(table.postId),
    };
  },
);
