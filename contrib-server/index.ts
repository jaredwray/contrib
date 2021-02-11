/**
 * @description holds server main
 */

// configuring environment variables
import { config as configureEnv } from 'dotenv';
configureEnv();

// creating apollo server
import apolloServer from './graphql';

const port: string = process.env.PORT as string;

// start listening
apolloServer.listen(port).then(({ url }) => {
  console.log(`Apollo Server is running on ${url} `);
});
