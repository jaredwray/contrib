import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  //New Relic
  if (
    process.env.NEWRELIC_LICENSE_KEY !== undefined &&
    process.env.NEW_RELIC_APP_NAME !== undefined
  ) {
    require('newrelic');
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}

bootstrap().then(
  () => {
    console.log(`application bootstrapped and listening at port ${port}`);
  },
  (error) => {
    console.error(`failed bootstrapping application`, error);
  },
);
