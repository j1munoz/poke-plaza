// src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";   // v5 adapter
import clientPromise from "@/lib/db";                     // Promise<MongoClient>
import { compare } from "bcryptjs";

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
    Credentials({
      name: "Email & Password",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email =
          typeof creds?.email === "string" ? creds.email.toLowerCase().trim() : "";
        const password =
          typeof creds?.password === "string" ? creds.password : "";
        if (!email || !password) return null;

        const db = (await clientPromise).db();
        const user = await db.collection("users").findOne({ email });
        if (!user || typeof (user as any).password !== "string") return null;

        const ok = await compare(password, (user as any).password as string);
        if (!ok) return null;

        return {
          id: String((user as any)._id),
          email: user.email as string,
          name: (user as any).name ?? undefined,
          image: (user as any).image ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user?.id) token.id = user.id as string;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user && token?.id) (session.user as any).id = token.id;
      return session;
    },
  },
});




// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import { clientPromise, getDb } from "@/lib/db";
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
