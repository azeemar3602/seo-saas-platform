import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

// Edge-safe NextAuth config: no providers, no DB/bcrypt imports. The proxy
// (src/proxy.ts) runs in the Edge runtime and can't load better-sqlite3, so
// this file must stay free of anything Node-only. The Credentials provider
// and the `jwt` callback that reads from the database live in src/auth.ts
// instead, which is only ever imported from Node runtime code (route
// handlers, server components, server actions).
//
// The `session` callback DOES live here, not just in auth.ts: proxy.ts
// builds its own separate NextAuth(authConfig) instance to decode the
// session for route protection, and that instance only ever calls the
// callbacks defined in *this* object. Custom JWT claims (role,
// isPlatformAdmin, organizationId) are already baked into the token by the
// time the edge proxy sees it — session() here just needs to copy them onto
// session.user, which is pure data shuffling, not a DB call.
export const authConfig = {
  // Required behind a reverse proxy (Hostinger's hcdn, Vercel, etc.) where
  // the request host header is the proxy's, not localhost — otherwise every
  // session read throws UntrustedHost. This must live here (not only on the
  // full config in auth.ts) because proxy.ts builds its own separate
  // NextAuth(authConfig) instance that does not inherit auth.ts's settings.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "owner" | "member";
        session.user.isPlatformAdmin = token.isPlatformAdmin as boolean;
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    },
    authorized({ request, auth }) {
      const { pathname, origin } = request.nextUrl;
      const isLoggedIn = !!auth?.user;

      if (!isLoggedIn) {
        const loginUrl = new URL("/login", origin);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (pathname.startsWith("/admin") && !auth?.user?.isPlatformAdmin) {
        return NextResponse.redirect(new URL("/dashboard", origin));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
