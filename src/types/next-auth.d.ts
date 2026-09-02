import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "owner" | "member";
      isPlatformAdmin: boolean;
      organizationId: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: "owner" | "member";
    isPlatformAdmin: boolean;
    organizationId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "owner" | "member";
    isPlatformAdmin: boolean;
    organizationId: string;
  }
}
