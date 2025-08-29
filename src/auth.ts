// src/auth.ts
import NextAuth, { type AuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import type { JWT } from "next-auth/jwt";
import type { Session, User as NextAuthUser } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

type TokenWithExtras = JWT & { id?: string; username?: string | null };

const authConfig: AuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: AdapterUser | NextAuthUser | null;
    }): Promise<JWT> {
      const t = token as TokenWithExtras;
      if (user && "id" in user && user.id) t.id = String(user.id);

      if (t.id && t.username === undefined) {
        try {
          const db = (await clientPromise).db();
          const doc = await db
            .collection("users")
            .findOne(
              { _id: new ObjectId(t.id) },
              { projection: { username: 1 } },
            );
          t.username = (doc as { username?: string })?.username ?? null;
        } catch {
          t.username = null;
        }
      }
      return t;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      const t = token as TokenWithExtras;
      if (session.user) {
        (session.user as any).id = t.id ?? undefined;
        (session.user as any).username = t.username ?? null;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
};

// Call NextAuth once, then export the pieces you need:
const authResult = NextAuth(authConfig);

export const { auth, signIn, signOut } = authResult;
// Export GET/POST directly so the route can re-export them
export const { GET, POST } = authResult.handlers;
