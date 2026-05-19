import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const dbPath = path.join(process.cwd(), "prisma", "emotional-ping.db");
mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "partnerId" TEXT,
  "inviteCode" TEXT,
  "telegramConnected" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_inviteCode_key" ON "User" ("inviteCode");

CREATE TABLE IF NOT EXISTS "TelegramConnection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "chatId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TelegramConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "TelegramConnection_userId_key" ON "TelegramConnection" ("userId");

CREATE TABLE IF NOT EXISTS "Ping" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "senderId" TEXT NOT NULL,
  "receiverId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "isUrgent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "seenAt" DATETIME,
  "respondedAt" DATETIME,
  CONSTRAINT "Ping_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Ping_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Ping_senderId_createdAt_idx" ON "Ping" ("senderId", "createdAt");
CREATE INDEX IF NOT EXISTS "Ping_receiverId_createdAt_idx" ON "Ping" ("receiverId", "createdAt");

CREATE TABLE IF NOT EXISTS "Response" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "pingId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Response_pingId_fkey" FOREIGN KEY ("pingId") REFERENCES "Ping" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Response_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Response_pingId_createdAt_idx" ON "Response" ("pingId", "createdAt");

CREATE TABLE IF NOT EXISTS "Song" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "senderId" TEXT NOT NULL,
  "receiverId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "youtubeLink" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Song_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Song_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Song_senderId_createdAt_idx" ON "Song" ("senderId", "createdAt");
CREATE INDEX IF NOT EXISTS "Song_receiverId_createdAt_idx" ON "Song" ("receiverId", "createdAt");

CREATE TABLE IF NOT EXISTS "AudioNote" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "senderId" TEXT NOT NULL,
  "receiverId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "durationMs" INTEGER NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AudioNote_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AudioNote_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "AudioNote_senderId_createdAt_idx" ON "AudioNote" ("senderId", "createdAt");
CREATE INDEX IF NOT EXISTS "AudioNote_receiverId_createdAt_idx" ON "AudioNote" ("receiverId", "createdAt");
`);

db.close();
console.log(`SQLite database ready at ${dbPath}`);
