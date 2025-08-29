// src/lib/db.ts
// MongoDB connection helper (native driver). Caches the connection in dev and ensures a unique index on users.email.

// src/lib/db.ts
import { MongoClient, Db, Collection, Document } from "mongodb"

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "pokeplaza";

declare global {
  // eslint-disable-next-line no-var
  var _mongo: { client?: MongoClient; db?: Db } | undefined;
}

export async function dbConnect(): Promise<Db> {
  if (!uri) throw new Error("Missing MONGODB_URI");

  if (!global._mongo) global._mongo = {};
  if (global._mongo.db) return global._mongo.db;

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  await db.collection("users").createIndex({ email: 1 }, { unique: true });

  // NEW: username must be unique only when present
  await db.collection("users").createIndex(
    { username: 1 },
    { unique: true, partialFilterExpression: { username: { $exists: true } } }
  );

  global._mongo.client = client;
  global._mongo.db = db;
  return db;
}

// For callers that want a Db (named import)
export async function getDb(name?: string): Promise<Db> {
  const db = await dbConnect();
  if (name && global._mongo?.client) return global._mongo.client.db(name);
  return db;
}

export async function getCollection<T extends Document = Document>(
  name: string,
  databaseName?: string
): Promise<Collection<T>> {
  const db = await getDb(databaseName);
  return db.collection<T>(name);
}

export const clientPromise: Promise<MongoClient> = (async () => {
  if (global._mongo?.client) return global._mongo.client;
  await dbConnect();
  if (!global._mongo?.client) {
    const client = new MongoClient(uri);
    await client.connect();
    global._mongo = { ...(global._mongo ?? {}), client, db: client.db(dbName) };
  }
  return global._mongo!.client!;
})();

export default clientPromise;


// import { MongoClient, Db, Collection, Document } from "mongodb"

// const uri = process.env.MONGODB_URI!;
// const dbName = process.env.MONGODB_DB || "pokeplaza";

// declare global {
//   // eslint-disable-next-line no-var
//   var _mongo: { client?: MongoClient; db?: Db } | undefined;
// }

// export async function dbConnect(): Promise<Db> {
//   if (!uri) throw new Error("Missing MONGODB_URI");

//   if (!global._mongo) global._mongo = {};
//   if (global._mongo.db) return global._mongo.db;

//   const client = new MongoClient(uri);
//   await client.connect();
//   const db = client.db(dbName);

//   await db.collection("users").createIndex({ email: 1 }, { unique: true });

//   global._mongo.client = client;
//   global._mongo.db = db;
//   return db;
// }

// // For callers that want a Db (named import)
// export async function getDb(name?: string): Promise<Db> {
//   const db = await dbConnect();
//   // allow switching db name on demand if a client exists
//   if (name && global._mongo?.client) return global._mongo.client.db(name);
//   return db;
// }

// // Convenience helper for collections
// export async function getCollection<T extends Document = Document>(
//   name: string,
//   databaseName?: string
// ): Promise<Collection<T>> {
//   const db = await getDb(databaseName);
//   return db.collection<T>(name);
// }

// // For libs (e.g., NextAuth adapter) that expect a Promise<MongoClient>
// export const clientPromise: Promise<MongoClient> = (async () => {
//   if (global._mongo?.client) return global._mongo.client;
//   await dbConnect(); // ensures global._mongo.client/db are set
//   if (!global._mongo?.client) {
//     const client = new MongoClient(uri);
//     await client.connect();
//     global._mongo = { ...(global._mongo ?? {}), client, db: client.db(dbName) };
//   }
//   return global._mongo!.client!;
// })();

// // Default export = clientPromise (handy for adapters)
// export default clientPromise;
