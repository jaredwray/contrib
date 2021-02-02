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

let cors = null;
if (process.env.NODE_ENV !== 'production') {
  appLogger.warn(
    'enabling lax CORS policies for local development; should not happen in production',
  );
  cors = {
    origin: 'http://localhost:3000',
    credentials: true,
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
