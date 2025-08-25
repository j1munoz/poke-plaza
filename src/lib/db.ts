// MongoDB connection helper (native driver). Caches the connection in dev and ensures a unique index on users.email.

import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "pokeplaza";

declare global {
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

  global._mongo.client = client;
  global._mongo.db = db;
  return db;
}
