import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  if(process.env.NEWRELIC_LICENSE_KEY !== undefined && process.env.NEW_RELIC_APP_NAME !== undefined) {
    require("newrelic");
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
