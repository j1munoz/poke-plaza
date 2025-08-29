// src/lib/mongo.ts

// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Missing MONGODB_URI");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri);
const clientPromise = global._mongoClientPromise ?? client.connect();
if (process.env.NODE_ENV !== "production") global._mongoClientPromise = clientPromise;

export default clientPromise;

// import { MongoClient, Db } from "mongodb";

// let _clientPromise: Promise<MongoClient> | null = null;
// let _db: Db | null = null;

// function getClient(): Promise<MongoClient> {
//   const uri = process.env.MONGODB_URI;
//   if (!uri) {
//     throw new Error("MONGODB_URI is not set");
//   }
//   if (!_clientPromise) {
//     const client = new MongoClient(uri);
//     _clientPromise = client.connect();
//   }
//   return _clientPromise;
// }

// export async function getDb(): Promise<Db> {
//   if (_db) return _db;
//   const dbName = process.env.MONGODB_DB || "pokeplaza";
//   const client = await getClient();
//   const db = client.db(dbName);
//   await db.collection("users").createIndex({ email: 1 }, { unique: true });
//   _db = db;
//   return db;
// }

// export default getClient;

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
