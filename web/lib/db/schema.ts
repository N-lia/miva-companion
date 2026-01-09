import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('User', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    confidentCourses: text('confidentCourses').notNull(), // JSON string
    helpCourses: text('helpCourses').notNull(), // JSON string
    createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const groups = sqliteTable('Group', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    memberIds: text('memberIds').notNull(), // JSON string
    createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});
