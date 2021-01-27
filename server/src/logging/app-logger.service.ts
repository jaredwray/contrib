import { Injectable, Scope, Logger } from '@nestjs/common';
import { winstonLogger } from './winstonLogger';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends Logger {
  log(message: string, context?: string) {
    winstonLogger.info(message, { context: context || this.context });
  }
  error(message: string, trace?: string, context?: string) {
    winstonLogger.error(message, {
      context: context || this.context,
      trace: trace,
    });
  }
  warn(message: string, context?: string) {
    winstonLogger.warn(message, { context: context || this.context });
  }
  debug(message: string, context?: string) {
    winstonLogger.debug(message, { context: context || this.context });
  }
  verbose(message: string, context?: string) {
    winstonLogger.verbose(message, { context: context || this.context });
  }
}
