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
    /**
     * If SERVE_CLIENT_APP env variable is set,
     * serves client app from ./client folder.
     *
     * Build script is responsible to put client distribution there.
     * Not used when developing locally.
     */
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        return [{ rootPath: join(__dirname, '../../../client/build') }];
      },
      inject: [ConfigService],
    }),
    MongoModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
