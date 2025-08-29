import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import type { JWT } from "next-auth/jwt";
import type { Session, User as NextAuthUser } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

type TokenWithExtras = JWT & { id?: string; username?: string | null };

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  trustHost: true,
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
        type AugUser = typeof session.user & {
          id?: string;
          username?: string | null;
        };
        const u = session.user as AugUser;
        u.id = t.id ?? undefined;
        u.username = t.username ?? null;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
});

// // src/auth.ts
// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import clientPromise from "@/lib/db";
// import { ObjectId } from "mongodb";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: MongoDBAdapter(clientPromise),
//   session: { strategy: "jwt" },
//   trustHost: true,
//   secret: process.env.AUTH_SECRET,
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }: any) {
//       if (user?.id) token.id = user.id as string;

//       if (token?.id && token.username === undefined) {
//         try {
//           const db = (await clientPromise).db();
//           const doc = await db
//             .collection("users")
//             .findOne(
//               { _id: new ObjectId(token.id) },
//               { projection: { username: 1 } },
//             );
//           (token as any).username = doc?.username ?? null;
//         } catch {
//           (token as any).username = null;
//         }
//       }

//       return token;
//     },
//     async session({ session, token }: any) {
//       if (session.user && token?.id) {
//         (session.user as any).id = token.id;
//         (session.user as any).username = (token as any).username ?? null;
//       }
//       return session;
//     },
//   },
//   debug: process.env.NODE_ENV !== "production",
// });
