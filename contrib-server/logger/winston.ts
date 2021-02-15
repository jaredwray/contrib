import winston, { format, transports as wts } from 'winston';
import { AppConfig } from '../config';

const consoleTransport = new wts.Console({
  level: 'debug',
  format: format.combine(
    format.label({ label: 'contrib' }),
    format.timestamp(),
    format.colorize(),
    format.printf((info) => {
      const { timestamp, label, context, level, message, ...rest } = info;
      const base = `${timestamp} [${label}] {{${context}}} ${level}: ${message}`;
      if (Object.keys(rest).length) {
        return `${base}\nmeta = ${JSON.stringify(rest, null, 2)}`;
      }
      return base;
    }),
  ),
});

const transports: winston.transport[] = [consoleTransport];
if (AppConfig.newRelic.enabled) {
  // eslint-disable-next-line
  const newrelicFormatter = require('@newrelic/winston-enricher');
  const newrelicTransport = new wts.Http({
    level: 'debug',
    format: newrelicFormatter(),
    ssl: true,
    host: 'log-api.newrelic.com',
    path: 'log/v1',
    headers: { 'X-License-Key': AppConfig.newRelic.licenseKey },
  });
  transports.push(newrelicTransport);
}

export const winstonTransports = transports;
