import { LogLevels, setLogLevel } from '@typegoose/typegoose';
import { config, createLogger, format, transports } from 'winston';

const { combine, timestamp, json } = format;
export const logger = createLogger({
  levels: config.syslog.levels,
  defaultMeta: { component: 'backend' },
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      dirname: 'logs',
      filename: 'combined.log',
    }),
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
  ],
});
export const dbLogger = logger;
if (process.env.production) {
  setLogLevel(LogLevels.SILENT);
} else {
  // setLogLevel(LogLevels.);
}
