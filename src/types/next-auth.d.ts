import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // allow undefined
      username?: string | null; // allow null
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    username?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string | null;
  }
}
