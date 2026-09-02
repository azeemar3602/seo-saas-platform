import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// A separate, edge-safe NextAuth instance built from the provider-less
// authConfig only — deliberately not importing from @/auth, since that file
// pulls in the Credentials provider and @/lib/db (better-sqlite3), which
// cannot run in the Edge runtime this proxy executes in. Route protection
// itself is implemented in auth.config.ts's `authorized` callback.
export const { auth: proxy } = NextAuth(authConfig);

export default proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/research/:path*",
    "/agents/:path*",
    "/pricing",
    "/learn",
    "/help",
    "/admin/:path*",
  ],
};
