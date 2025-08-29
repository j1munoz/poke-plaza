// src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

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
    // Put id and username onto the token
    async jwt({ token, user }: any) {
      if (user?.id) token.id = user.id as string;

      // Load username once per session (first time jwt runs)
      if (token?.id && token.username === undefined) {
        try {
          const db = (await clientPromise).db();
          const doc = await db
            .collection("users")
            .findOne({ _id: new ObjectId(token.id) }, { projection: { username: 1 } });
          (token as any).username = doc?.username ?? null;
        } catch {
          (token as any).username = null;
        }
      }

      return token;
    },
    // Expose id + username on the session object used by your UI
    async session({ session, token }: any) {
      if (session.user && token?.id) {
        (session.user as any).id = token.id;
        (session.user as any).username = (token as any).username ?? null;
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
//       return token;
//     },
//     async session({ session, token }: any) {
//       if (session.user && token?.id) (session.user as any).id = token.id;
//       return session;
//     },
//   },
//   // Optional: helpful during development
//   debug: process.env.NODE_ENV !== "production",
// });

