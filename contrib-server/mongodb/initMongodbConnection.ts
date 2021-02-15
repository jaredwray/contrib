import { createConnection } from 'mongoose';
import { AppConfig } from '../config';

const connection = createConnection(AppConfig.mongodb.uri, {
  bufferCommands: false,
  useCreateIndex: true,
  // @ts-ignore
  useUnifiedTopology: true,
  // @ts-ignore
  useNewUrlParser: true
});

export async function initMongodbConnection() {
  return connection;
}
