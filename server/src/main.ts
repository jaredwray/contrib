import './newrelic';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { appLogger } from './logging/appLogger';

const port = process.env.PORT || 3000;

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
