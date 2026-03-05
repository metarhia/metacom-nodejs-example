'use strict';

const fs = require('node:fs');
const util = require('node:util');
const path = require('node:path');

const COLORS = {
  log: '\x1b[1;37m',
  info: '\x1b[1;34m',
  warn: '\x1b[1;33m',
  error: '\x1b[0;31m',
  debug: '\x1b[1;35m',
};

const RESET = '\x1b[0m';
const DATETIME_LENGTH = 19;

class Logger {
  constructor(logPath) {
    fs.mkdirSync(logPath, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const filePath = path.join(logPath, `${date}.log`);
    this.stream = fs.createWriteStream(filePath, { flags: 'a' });
  }

  write(level, ...args) {
    const msg = util.format(...args);
    const now = new Date().toISOString().slice(0, DATETIME_LENGTH);
    const line = `${now}\t[${level.toUpperCase()}]\t${msg}`;
    process.stdout.write(COLORS[level] + line + RESET + '\n');
    this.stream.write(line.replace(/[\n\r]\s*/g, '; ') + '\n');
  }

  log(...args) {
    this.write('log', ...args);
  }

  info(...args) {
    this.write('info', ...args);
  }

  warn(...args) {
    this.write('warn', ...args);
  }

  error(...args) {
    this.write('error', ...args);
  }

  debug(...args) {
    this.write('debug', ...args);
  }

  close() {
    return new Promise((resolve) => this.stream.end(resolve));
  }
}

module.exports = { Logger };
