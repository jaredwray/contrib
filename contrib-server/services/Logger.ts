import winston, { createLogger, format, transports as wts } from 'winston';
import { NewrelicConfig } from './newrelic';

const consoleTransport: wts.ConsoleTransportInstance = new wts.Console({
  level: 'debug',
  format: format.combine(
    format.label({ label: 'contrib' }),
    format.timestamp(),
    format.colorize(),
    format.printf((info) => {
      const base = `${info.timestamp} [${info.label}] {{${info.context}}} ${info.level}: ${info.message}`;
      return info.trace ? `${base}\n${info.trace}` : base;
    }),
  ),
});

const transports: winston.transport[] = [consoleTransport];
if (NewrelicConfig) {
  // eslint-disable-next-line
  const newrelicFormatter = require('@newrelic/winston-enricher');
  const newrelicTransport = new wts.Http({
    level: 'debug',
    format: newrelicFormatter(),
    ssl: true,
    host: 'log-api.newrelic.com',
    path: 'log/v1',
    headers: { 'X-License-Key': NewrelicConfig.licenseKey },
  });
  transports.push(newrelicTransport);
}

export const Logger: winston.Logger = createLogger({
  transports: transports,
});
