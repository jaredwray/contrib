import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    /**
     * Load env variables based on .env files and value of CONTRIB_ENV.
     * If CONTRIB_ENV is set to "live", .env.live is loaded;
     * Otherwise, uses .env.dev;
     */
    ConfigModule.forRoot({
      envFilePath: [
        '.env',
        process.env.CONTRIB_ENV === 'live' ? '.env.live' : '.env.dev',
      ],
    }),
    /**
     * If SERVE_CLIENT_FROM_PATH env variable is present,
     * serves client app from that folder.
     */
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const clientAssetsPath = configService.get<string>(
          'SERVE_CLIENT_FROM_PATH',
        );
        if (!clientAssetsPath) {
          return [];
        }
        return [{ rootPath: clientAssetsPath }];
      },
      inject: [ConfigService],
    }),
    // MongoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
