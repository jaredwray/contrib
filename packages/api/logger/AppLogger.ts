import { createLogger } from 'winston';
import { winstonTransports } from './winston';

export const AppLogger = createLogger({
  transports: winstonTransports,
});
