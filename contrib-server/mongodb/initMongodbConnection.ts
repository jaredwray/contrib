import { createConnection, Connection } from 'mongoose';
import { AppConfig } from '../config';

const connection = createConnection(AppConfig.mongodb.uri, {
  bufferCommands: false,
  useCreateIndex: true,
  //@ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function initMongodbConnection(): Promise<Connection> {
  return connection;
}
