// auth.ts

// src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

import clientPromise, { getDb } from "@/lib/mongo";
import bcrypt from "bcryptjs";
import type { ObjectId } from "mongodb";

interface UserDoc {
  _id: ObjectId;
  email: string;
  password?: string;
  name?: string | null;
  image?: string | null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise(), {
    databaseName: process.env.MONGODB_DB,
  }),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const email = String(raw?.email ?? "")
          .toLowerCase()
          .trim();
        const password = String(raw?.password ?? "");
        if (!email || !password) return null;

        const db = await getDb();
        const user = await db.collection<UserDoc>("users").findOne({ email });
        if (!user?.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user)
        (session.user as { id?: string }).id = String(token.uid ?? "");
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});

// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import { clientPromise, getDb } from "@/lib/mongo";
// import bcrypt from "bcryptjs";
// import type { ObjectId } from "mongodb";

// interface UserDoc {
//   _id: ObjectId;
//   email: string;
//   password?: string;
//   name?: string | null;
//   image?: string | null;
// }

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: MongoDBAdapter(clientPromise, {
//     databaseName: process.env.MONGODB_DB,
//   }),
//   session: { strategy: "jwt" },
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     Credentials({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (raw) => {
//         const email = String(raw?.email ?? "")
//           .toLowerCase()
//           .trim();
//         const password = String(raw?.password ?? "");
//         if (!email || !password) return null;

//         const db = await getDb();
//         const user = await db.collection<UserDoc>("users").findOne({ email });
//         if (!user?.password) return null;

//         const ok = await bcrypt.compare(password, user.password);
//         if (!ok) return null;

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name ?? null,
//           image: user.image ?? null,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user?.id) token.uid = user.id;
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user)
//         (session.user as { id?: string }).id = String(token.uid ?? "");
//       return session;
//     },
//   },
//   secret: process.env.AUTH_SECRET,
// });
