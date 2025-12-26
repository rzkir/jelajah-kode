import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    provider?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    provider?: string;
    role?: string;
    accessToken?: string;
  }
}
