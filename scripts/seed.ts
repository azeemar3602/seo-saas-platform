/**
 * Seeds a platform-admin account and a demo customer organization so the
 * app is usable immediately after a fresh clone/deploy, without needing to
 * register through the UI first.
 *
 * Usage: npm run db:seed
 * Reads SEED_ADMIN_NAME / SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD from .env
 * (see .env.example) — change the password there before running this in
 * anything other than a local/pilot environment.
 */
import bcrypt from "bcryptjs";

try {
  // Node 20.6+/22 built-in .env loader — no dotenv dependency needed.
  // Silently no-ops if .env doesn't exist (defaults below still apply).
  process.loadEnvFile();
} catch {
  // no .env file present — fine, SEED_ADMIN_* defaults below are used
}

import {
  countPlatformAdmins,
  createOrganization,
  createPlatformAdmin,
  createOrganizationWithOwner,
  findUserByEmail,
} from "../src/lib/db";

async function main() {
  const adminName = process.env.SEED_ADMIN_NAME || "Platform Admin";
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@rankwellpilot.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "change-this-password";

  if (countPlatformAdmins() === 0 && !findUserByEmail(adminEmail)) {
    const org = createOrganization("Rankwell (Platform)", "Agency");
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    createPlatformAdmin({
      name: adminName,
      email: adminEmail,
      passwordHash,
      organizationId: org.id,
    });
    console.log(`Created platform admin: ${adminEmail}`);
  } else {
    console.log("Platform admin already exists — skipping.");
  }

  const demoEmail = "demo@rapidflowplumbing.com";
  if (!findUserByEmail(demoEmail)) {
    const passwordHash = await bcrypt.hash("demo-password-123", 10);
    createOrganizationWithOwner({
      organizationName: "Rapid Flow Plumbing",
      name: "Demo User",
      email: demoEmail,
      passwordHash,
    });
    console.log(`Created demo customer account: ${demoEmail} / demo-password-123`);
  } else {
    console.log("Demo customer account already exists — skipping.");
  }

  console.log("\nSeed complete. Sign in at /login with either account above.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
