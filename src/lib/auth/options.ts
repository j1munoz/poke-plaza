//src/app/api/auth/[...nextauth]/route.ts

import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
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

interface AccountDoc {
  _id?: ObjectId;
  userId: ObjectId | string;
  type: string;
  provider: string;
  providerAccountId: string;
  access_token?: string | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  refresh_token?: string | null;
  expires_at?: number | null;
  session_state?: string | null;
}

const adapter = MongoDBAdapter(clientPromise(), {
  databaseName: process.env.MONGODB_DB,
});

export const authOptions: NextAuthOptions = {
  adapter,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = (credentials?.email ?? "").toLowerCase().trim();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        const db = await getDb();
        const user = await db.collection<UserDoc>("users").findOne({ email });

        if (!user?.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: String(user._id),
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "google") return true;

      const email = (user.email ?? "").toLowerCase().trim();
      if (!email) return false;

      const db = await getDb();
      const usersCol = db.collection<UserDoc>("users");
      const accountsCol = db.collection<AccountDoc>("accounts");

      const existingUser = await usersCol.findOne({ email });
      if (!existingUser) return true;

      const existingLink = await accountsCol.findOne({
        provider: "google",
        providerAccountId: account.providerAccountId,
      });

      if (!existingLink) {
        const doc: AccountDoc = {
          userId: existingUser._id,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          access_token: account.access_token ?? null,
          token_type: account.token_type ?? null,
          scope: account.scope ?? null,
          id_token: account.id_token ?? null,
          refresh_token: account.refresh_token ?? null,
          expires_at: account.expires_at ?? null,
          session_state: account.session_state ?? null,
        };
        await accountsCol.insertOne(doc);
      } else if (String(existingLink.userId) !== String(existingUser._id)) {
        await accountsCol.updateOne(
          { _id: existingLink._id as ObjectId },
          { $set: { userId: existingUser._id } },
        );
      }

      return true;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

// import NextAuth, { type NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise, { getDb } from "@/lib/mongo";
// import bcrypt from "bcryptjs";

// const adapter = MongoDBAdapter(clientPromise, {
//   databaseName: process.env.MONGODB_DB,
// });

// export const authOptions: NextAuthOptions = {
//   adapter,
//   session: { strategy: "jwt" },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       // try provider-level auto-linking first
//       allowDangerousEmailAccountLinking: true,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         const email = (credentials?.email ?? "").toLowerCase().trim();
//         const password = credentials?.password ?? "";
//         if (!email || !password) return null;

//         const db = await getDb();
//         const user = await db
//           .collection<{
//             _id: unknown;
//             email: string;
//             password?: string;
//             name?: string | null;
//             image?: string | null;
//           }>("users")
//           .findOne({ email });

//         if (!user?.password) return null;

//         const ok = await bcrypt.compare(password, user.password);
//         if (!ok) return null;

//         return {
//           id: String(user._id),
//           email: user.email,
//           name: user.name ?? null,
//           image: user.image ?? null,
//         };
//       },
//     }),
//   ],
//   // in case your installed v4 ignores the provider flag, we link manually here
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider !== "google") return true;

//       const email = (user.email ?? "").toLowerCase().trim();
//       if (!email) return false;

//       const db = await getDb();
//       const usersCol = db.collection("users");
//       const accountsCol = db.collection("accounts");

//       // find the existing user doc by email (created previously via credentials)
//       const existingUser = await usersCol.findOne<{
//         _id: unknown;
//         email: string;
//       }>({ email });
//       if (!existingUser) return true; // no conflict, let NextAuth create/link as usual

//       // ensure there is an account link pointing to that user
//       const existingLink = await accountsCol.findOne({
//         provider: "google",
//         providerAccountId: account.providerAccountId,
//       });

//       if (!existingLink) {
//         await accountsCol.insertOne({
//           userId: existingUser._id,
//           type: account.type,
//           provider: account.provider,
//           providerAccountId: account.providerAccountId,
//           access_token: (account as any).access_token ?? null,
//           token_type: (account as any).token_type ?? null,
//           scope: (account as any).scope ?? null,
//           id_token: (account as any).id_token ?? null,
//           refresh_token: (account as any).refresh_token ?? null,
//           expires_at: (account as any).expires_at ?? null,
//           session_state: (account as any).session_state ?? null,
//         });
//       } else {
//         // if the link exists but points to another user, reattach it
//         if (String((existingLink as any).userId) !== String(existingUser._id)) {
//           await accountsCol.updateOne(
//             { _id: (existingLink as any)._id },
//             { $set: { userId: existingUser._id } },
//           );
//         }
//       }

//       // tell NextAuth to treat this as the same user
//       (user as any).id = String(existingUser._id);
//       return true;
//     },
//   },
//   pages: {
//     signIn: "/signin",
//     error: "/signin",
//   },
//   secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

//////////////////////////////////////////////////////////////////////////OLD

// import NextAuth, { type NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise, { getDb } from "@/lib/mongo";
// import bcrypt from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   adapter: MongoDBAdapter(clientPromise, {
//     databaseName: process.env.MONGODB_DB,
//   }),
//   session: { strategy: "jwt" },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         const email = (credentials?.email ?? "").toLowerCase().trim();
//         const password = credentials?.password ?? "";
//         if (!email || !password) return null;

//         const db = await getDb();
//         const user = await db
//           .collection<{ _id: unknown; email: string; password?: string; name?: string | null; image?: string | null }>("users")
//           .findOne({ email });

//         if (!user?.password) return null;

//         const ok = await bcrypt.compare(password, user.password);
//         if (!ok) return null;

//         return {
//           id: String(user._id),
//           email: user.email,
//           name: user.name ?? null,
//           image: user.image ?? null,
//         };
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
