import './newrelic';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppLogger } from './logging/app-logger.service';

const port = process.env.PORT || 3000;

const appLogger = new AppLogger('app');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: appLogger,
  });
  await app.listen(port);
}

bootstrap().then(
  () => {
    appLogger.log(`application bootstrapped and listening at port ${port}`);
  },
  (error) => {
    appLogger.error(`failed bootstrapping application`, error);
  },
);
