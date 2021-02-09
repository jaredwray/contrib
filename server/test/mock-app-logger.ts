import { AppLogger } from '../src/logging/app-logger.service';

export interface ContextualMessage {
  level: string;
  context: string;
  message: string;
}

export class MockAppLogger extends AppLogger {
  public messageContainer: ContextualMessage[];

  constructor(context?: string, isTimestampEnabled?: boolean) {
    super(context, isTimestampEnabled);
    this.messageContainer = [];
  }
  log(message: string, context?: string) {
    this.messageContainer.push({ level: 'log', context: context || this.context, message: message });
  }
  error(message: string, trace?: string, context?: string) {
    this.messageContainer.push({ level: 'error', context: context || this.context, message: message });
  }
  warn(message: string, context?: string) {
    this.messageContainer.push({ level: 'warn', context: context || this.context, message: message });
  }
  debug(message: string, context?: string) {
    this.messageContainer.push({ level: 'debug', context: context || this.context, message: message });
  }
  verbose(message: string, context?: string) {
    this.messageContainer.push({ level: 'verbose', context: context || this.context, message: message });
  }
}
