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
