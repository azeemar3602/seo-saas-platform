import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// ---------------------------------------------------------------------------
// Lightweight SQLite data layer for auth + subscriptions.
//
// This intentionally does not use an ORM/migration tool: the schema is two
// small tables, and Prisma's migration engine requires downloading a native
// binary at build time, which isn't guaranteed to work on every host (it
// failed in this project's own build sandbox). better-sqlite3 ships
// prebuilt binaries for common platforms and has zero external calls at
// build or run time, which is a safer bet for shared/managed Node hosting.
//
// If this product later needs Postgres for multi-instance/horizontal
// scaling, swap this file's implementation for a real client (Prisma,
// Drizzle, etc.) — nothing outside this file talks to SQLite directly.
// ---------------------------------------------------------------------------

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "app.db");

function getDb() {
  const g = globalThis as unknown as { __db?: Database.Database };
  if (g.__db) return g.__db;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'Starter',
      status TEXT NOT NULL DEFAULT 'trialing',
      trialEndsAt TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'owner',
      isPlatformAdmin INTEGER NOT NULL DEFAULT 0,
      organizationId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (organizationId) REFERENCES organizations(id)
    );
  `);
  g.__db = db;
  return db;
}

export type Plan = "Starter" | "Growth" | "Agency";
export type OrgStatus = "trialing" | "active" | "suspended" | "canceled";

export interface Organization {
  id: string;
  name: string;
  plan: Plan;
  status: OrgStatus;
  trialEndsAt: string | null;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "owner" | "member";
  isPlatformAdmin: 0 | 1;
  organizationId: string;
  createdAt: string;
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase().trim()) as UserRecord | undefined;
}

export function findUserById(id: string): UserRecord | undefined {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRecord | undefined;
}

export function findOrganizationById(id: string): Organization | undefined {
  return getDb().prepare("SELECT * FROM organizations WHERE id = ?").get(id) as
    | Organization
    | undefined;
}

export function createOrganizationWithOwner(input: {
  organizationName: string;
  name: string;
  email: string;
  passwordHash: string;
}): { user: UserRecord; organization: Organization } {
  const db = getDb();
  const now = new Date().toISOString();
  const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const orgId = randomUUID();
  const userId = randomUUID();

  const insertOrg = db.prepare(
    `INSERT INTO organizations (id, name, plan, status, trialEndsAt, createdAt)
     VALUES (?, ?, 'Starter', 'trialing', ?, ?)`
  );
  const insertUser = db.prepare(
    `INSERT INTO users (id, email, passwordHash, name, role, isPlatformAdmin, organizationId, createdAt)
     VALUES (?, ?, ?, ?, 'owner', 0, ?, ?)`
  );

  const tx = db.transaction(() => {
    insertOrg.run(orgId, input.organizationName, trialEndsAt, now);
    insertUser.run(userId, input.email.toLowerCase().trim(), input.passwordHash, input.name, orgId, now);
  });
  tx();

  return {
    user: findUserById(userId)!,
    organization: findOrganizationById(orgId)!,
  };
}

export interface OrganizationWithOwner extends Organization {
  ownerName: string;
  ownerEmail: string;
  memberCount: number;
}

export function listOrganizations(): OrganizationWithOwner[] {
  return getDb()
    .prepare(
      `SELECT
         o.*,
         (SELECT u.name FROM users u WHERE u.organizationId = o.id AND u.role = 'owner' LIMIT 1) as ownerName,
         (SELECT u.email FROM users u WHERE u.organizationId = o.id AND u.role = 'owner' LIMIT 1) as ownerEmail,
         (SELECT COUNT(*) FROM users u WHERE u.organizationId = o.id) as memberCount
       FROM organizations o
       ORDER BY o.createdAt DESC`
    )
    .all() as OrganizationWithOwner[];
}

export function updateOrganizationPlan(orgId: string, plan: Plan) {
  getDb().prepare("UPDATE organizations SET plan = ? WHERE id = ?").run(plan, orgId);
}

export function updateOrganizationStatus(orgId: string, status: OrgStatus) {
  getDb().prepare("UPDATE organizations SET status = ? WHERE id = ?").run(status, orgId);
}

export function countPlatformAdmins(): number {
  const row = getDb()
    .prepare("SELECT COUNT(*) as c FROM users WHERE isPlatformAdmin = 1")
    .get() as { c: number };
  return row.c;
}

export function createPlatformAdmin(input: {
  name: string;
  email: string;
  passwordHash: string;
  organizationId: string;
}) {
  const db = getDb();
  db.prepare(
    `INSERT INTO users (id, email, passwordHash, name, role, isPlatformAdmin, organizationId, createdAt)
     VALUES (?, ?, ?, ?, 'owner', 1, ?, ?)`
  ).run(
    randomUUID(),
    input.email.toLowerCase().trim(),
    input.passwordHash,
    input.name,
    input.organizationId,
    new Date().toISOString()
  );
}

export function createOrganization(name: string, plan: Plan = "Starter"): Organization {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO organizations (id, name, plan, status, trialEndsAt, createdAt)
     VALUES (?, ?, ?, 'active', NULL, ?)`
  ).run(id, name, plan, now);
  return findOrganizationById(id)!;
}
