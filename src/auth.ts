import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/db";
import { authConfig } from "@/auth.config";

// Full config: Node runtime only (Credentials provider touches better-sqlite3
// via @/lib/db, which does not run in the Edge middleware). Import this file
// from route handlers, server components, and server actions — never from
// middleware.ts, which uses the edge-safe @/auth.config instead.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const user = findUserByEmail(email);
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isPlatformAdmin: user.isPlatformAdmin === 1,
          organizationId: user.organizationId,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.isPlatformAdmin = user.isPlatformAdmin;
        token.organizationId = user.organizationId;
      }
      return token;
    },
  },
});
