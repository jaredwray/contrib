import { Connection, createConnection } from 'mongoose';

/**
 * @description holds database connection provider
 */

// connection uri
const uri: string = process.env.MONGODB_URI as string;

// mongoose connection
let conn: Connection | null = null;

/**
 * creates database connection
 * @returns mongodb connection
 */
export const getConnection = async (): Promise<Connection> => {
  if (conn == null) {
    conn = await createConnection(uri, {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }
  return conn;
};
