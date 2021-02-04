import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from './logging/logging.module';
import { MongoModule } from './mongo/mongo.module';
import { AccountingModule } from './accounting/accounting.module';
import { appLogger } from './logging/appLogger';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

let cors = null;
if (process.env.NODE_ENV !== 'live') {
  appLogger.warn('enabling lax CORS policies for local development; should not happen in production');
  cors = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
}
let formatError = null;
if (process.env.NODE_ENV === 'live') {
  formatError = (error: GraphQLError) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exception, ...rest } = error.extensions;
    const graphQLFormattedError: GraphQLFormattedError = {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: rest,
    };
    return graphQLFormattedError;
  };
}

@Module({
  imports: [
    /**
     * Load env variables based on .env files
     */
    ConfigModule.forRoot(),

    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        return [{ rootPath: join(__dirname, '../../../client/build') }];
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cors,
      formatError,
    }),
    MongoModule,
    LoggingModule,
    AccountingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
