//src/lib/mongo

import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "pokeplaza";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoDb: Db | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

const clientPromise = global._mongoClientPromise!;

export default clientPromise;

export async function getDb(): Promise<Db> {
  if (global._mongoDb) return global._mongoDb;
  const client = await clientPromise;
  const db = client.db(dbName);
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  global._mongoDb = db;
  return db;
}

// import { MongoClient, Db } from "mongodb";

// const uri = process.env.MONGODB_URI!;
// const dbName = process.env.MONGODB_DB || "pokeplaza";

// declare global {
//   // eslint-disable-next-line no-var
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
//   // eslint-disable-next-line no-var
//   var _mongoDb: Db | undefined;
// }

// if (!global._mongoClientPromise) {
//   const client = new MongoClient(uri);
//   global._mongoClientPromise = client.connect();
// }

// const clientPromise = global._mongoClientPromise!;

// export default clientPromise;

// export async function getDb(): Promise<Db> {
//   if (global._mongoDb) return global._mongoDb;
//   const client = await clientPromise;
//   const db = client.db(dbName);
//   await db.collection("users").createIndex({ email: 1 }, { unique: true });
//   global._mongoDb = db;
//   return db;
// }
