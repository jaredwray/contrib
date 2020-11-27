import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import { ContribDocuments } from 'models/database/docs'

export class MongoConnection {
  client: MongoClient
  db: Db
  docs: ContribDocuments
}

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

const clientOptions: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

let cached: MongoConnection | null = null

export async function connectToDatabase(): Promise<MongoConnection> {
  if (!cached) {
    const client = await MongoClient.connect(uri, clientOptions)
    const db = client.db()
    const docs = new ContribDocuments(db)
    cached = { client, db, docs }
  }
  return cached
}
