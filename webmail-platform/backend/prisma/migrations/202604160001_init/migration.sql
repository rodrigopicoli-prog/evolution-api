-- Create extension and initial schema generated manually for VPS bootstrap
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "EmailAccount" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "imapHost" TEXT NOT NULL,
  "imapPort" INTEGER NOT NULL,
  "smtpHost" TEXT NOT NULL,
  "smtpPort" INTEGER NOT NULL,
  "username" TEXT NOT NULL,
  "passwordEncrypted" TEXT NOT NULL,
  "useTls" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "Folder" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "systemKey" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Email" (
  "id" TEXT PRIMARY KEY,
  "externalId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "emailAccountId" TEXT NOT NULL REFERENCES "EmailAccount"("id") ON DELETE CASCADE,
  "folderId" TEXT,
  "subject" TEXT NOT NULL,
  "fromAddress" TEXT NOT NULL,
  "toAddress" TEXT NOT NULL,
  "textBody" TEXT NOT NULL,
  "htmlBody" TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "isArchived" BOOLEAN NOT NULL DEFAULT false,
  "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  "isFavorite" BOOLEAN NOT NULL DEFAULT false,
  "aiCategory" TEXT,
  "aiPriority" TEXT,
  "aiSummary" TEXT,
  "aiAction" TEXT,
  "aiSuggestedReply" TEXT,
  "receivedAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  UNIQUE ("externalId", "emailAccountId")
);

CREATE TABLE "Attachment" (
  "id" TEXT PRIMARY KEY,
  "emailId" TEXT NOT NULL REFERENCES "Email"("id") ON DELETE CASCADE,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "storageKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AILog" (
  "id" TEXT PRIMARY KEY,
  "emailId" TEXT NOT NULL REFERENCES "Email"("id") ON DELETE CASCADE,
  "model" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "response" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AutomationRule" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "condition" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "action" TEXT NOT NULL,
  "metadata" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
