// src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";

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
    async jwt({ token, user }: any) {
      if (user?.id) token.id = user.id as string;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user && token?.id) (session.user as any).id = token.id;
      return session;
    },
  },
  // Optional: helpful during development
  debug: process.env.NODE_ENV !== "production",
});

// src/auth.ts
// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";   // v5 adapter
// import clientPromise from "@/lib/db";                     // Promise<MongoClient>
// import { compare } from "bcryptjs";

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
//     Credentials({
//       name: "Email & Password",
//       credentials: { email: {}, password: {} },
//       async authorize(creds) {
//         const email =
//           typeof creds?.email === "string" ? creds.email.toLowerCase().trim() : "";
//         const password =
//           typeof creds?.password === "string" ? creds.password : "";
//         if (!email || !password) return null;

//         const db = (await clientPromise).db();
//         const user = await db.collection("users").findOne({ email });
//         if (!user || typeof (user as any).password !== "string") return null;

//         const ok = await compare(password, (user as any).password as string);
//         if (!ok) return null;

//         return {
//           id: String((user as any)._id),
//           email: user.email as string,
//           name: (user as any).name ?? undefined,
//           image: (user as any).image ?? undefined,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }: any) {
//       if (user?.id) token.id = user.id as string;
//       return token;
//     },
//     async session({ session, token }: any) {
//       if (session.user && token?.id) (session.user as any).id = token.id;
//       return session;
//     },
//   },
// });