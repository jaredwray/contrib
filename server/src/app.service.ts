import { Injectable } from '@nestjs/common';
import { AppLogger } from './logging/app-logger.service';

@Injectable()
export class AppService {
  constructor(private logger: AppLogger) {
    this.logger.setContext('AppService');
  }

  getHello(): string {
    this.logger.log('executing `getHello` command');
    return 'Hello World!';
  }
}
