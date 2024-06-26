import { index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    username: text("username"),
    discordId: text("discord_id").notNull(),
    createdAt: integer("created_at").notNull(),
    createdIp: text("created_ip").notNull(),
    type: text("type").default("user"), // types: user, mod, admin
    banned: integer("banned").default(0),
  },
  (table) => ({
    discordIdx: index("discord_idx").on(table.discordId),
  }),
);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export const images = sqliteTable(
  "images",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(),
    verified: integer("verified").default(0),
    name: text("name"),
    uploadedBy: text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: integer("created_at").notNull(),
    uploadedIp: text("uploaded_ip").notNull(),
    acceptedBy: text("accepted_by"),
  },
  (table) => ({
    typeIdx: index("type_idx").on(table.type),
  }),
);

export const imageReports = sqliteTable("image_reports", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  createdIp: text("created_ip").notNull(),
  imageId: text("image_id").references(() => images.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  content: text("content").notNull(),
});

export const imageLikes = sqliteTable(
  "image_likes",
  {
    id: text("id").primaryKey(),
    createdAt: integer("created_at").notNull(),
    createdIp: text("created_ip").notNull(),
    imageId: text("image_id").references(() => images.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => ({
    unq: unique().on(table.createdIp, table.imageId),
  }),
);

export const requests = sqliteTable("requests", {
  type: text("path").primaryKey(),
  served: integer("served").default(1),
  createdAt: integer("created_at").notNull(),
});
