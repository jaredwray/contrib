import mongoose from 'mongoose';
import { createConnection, Connection } from 'mongoose';
import { AppConfig } from '../config';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoServer = new MongoMemoryServer();

export const initInMemoryMongodbConnection = async (): Promise<any> => {
  const uri = await mongoServer.getUri();
  return await mongoose.connect(uri);
};
export const closeInMemoryMongodbConnection = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

const connection = createConnection(AppConfig.mongodb.uri);
export async function initMongodbConnection(): Promise<Connection> {
  return connection;
}
