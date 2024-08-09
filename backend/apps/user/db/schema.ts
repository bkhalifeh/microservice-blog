import { pgTable, varchar, char, serial, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 64 }).notNull(),
  email: varchar('email', { length: 254 }).notNull().unique(),
  password: char('password', { length: 96 }).notNull(),
});
