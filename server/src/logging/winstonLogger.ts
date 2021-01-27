import winston, { createLogger, format, transports as wts } from 'winston';
import * as newrelicFormatter from '@newrelic/winston-enricher';

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
if (
  process.env.NEWRELIC_LICENSE_KEY !== undefined &&
  process.env.NEW_RELIC_APP_NAME !== undefined
) {
  const newrelicTransport = new wts.Http({
    level: 'debug',
    format: newrelicFormatter(),
    ssl: true,
    host: 'log-api.newrelic.com',
    path: 'log/v1',
    headers: { 'X-License-Key': 'b9e03c47498ad937b02b33b266580947FFFFNRAL' },
  });
  transports.push(newrelicTransport);
}

export const winstonLogger: winston.Logger = createLogger({
  transports: transports,
});
