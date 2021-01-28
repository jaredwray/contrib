import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentVariables } from './environment-variables';
import { LoggingModule } from './logging/logging.module';
import { MongoModule } from './mongo/mongo.module';

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
    MongoModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
