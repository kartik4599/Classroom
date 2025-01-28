import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  smallserial,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  id: smallserial().primaryKey(),
  name: varchar().notNull(),
  socketId: varchar(),
  roomId: uuid("roomId").references(() => Room.id),
});

export const Room = pgTable("room", {
  id: uuid().primaryKey().defaultRandom(),
  hostId: integer("hostId").references(() => User.id),
});

export const UserRelations = relations(User, ({ one }) => ({
  room: one(Room, {
    fields: [User.roomId],
    references: [Room.id],
  }),
}));

export const RoomRelations = relations(Room, ({ many, one }) => ({
  members: many(User),
  host: one(User, {
    fields: [Room.hostId],
    references: [User.id],
  }),
}));
