'use strict';

const path = require('node:path');
const { Server } = require('metacom');
const { Logger } = require('./lib/logger.js');
const { Static } = require('./lib/static.js');
const { load } = require('./lib/loader.js');

const HOST = '127.0.0.1';
const PORT = 8000;
const appPath = process.cwd();

const main = async () => {
  const logger = new Logger(path.join(appPath, 'log'));
  const sandbox = { console: logger };
  const loader = load(appPath, sandbox);
  const staticServer = new Static(path.join(appPath, 'static'));

  const application = {
    console: logger,
    static: staticServer,
    auth: { saveSession: async () => {} },
    getMethod: loader.getMethod,
  };

  const options = {
    host: HOST,
    port: PORT,
    protocol: 'http',
    cors: { origin: '*' },
  };

  const server = new Server(application, options);
  await server.listen();

  logger.info(`Server started at http://${HOST}:${PORT}`);

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    await server.close();
    await logger.close();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  return server;
};

main().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});
