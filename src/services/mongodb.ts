import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import { ContribDocuments } from 'models/database/docs'

const uri = process.env.MONGODB_URI

const clientOptions: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

export class MongoConnection {
  client: MongoClient
  db: Db
  docs: ContribDocuments
}

let cached: MongoConnection | null = null

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

export async function connectToDatabase(): Promise<MongoConnection> {
  if (!cached) {
    const client = await MongoClient.connect(uri, clientOptions)
    const db = client.db()
    const docs = new ContribDocuments(db)
    cached = { client, db, docs }
  }
  return cached
}
