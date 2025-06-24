import * as winston from 'winston';

export const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error',
      format: winston.format.json()
    })
  ]
});

// Prevent exiting on uncaught errors, log them instead
process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception', { error });
});

process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Rejection', { reason, promise });
}); 