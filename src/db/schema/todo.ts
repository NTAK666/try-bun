import { InferSelectModel } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todo', {
  id: integer('id', { mode: 'number' }).primaryKey(),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
});
export type Todo = InferSelectModel<typeof todos>;
