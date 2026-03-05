'use strict';

const fs = require('node:fs');
const path = require('node:path');

const load = (appPath, { console: logger }) => {
  const apiPath = path.join(appPath, 'api');
  const methods = new Map();

  let unitDirs;
  try {
    unitDirs = fs.readdirSync(apiPath, { withFileTypes: true });
  } catch {
    throw new Error(`API directory not found: ${apiPath}`);
  }

  for (const entry of unitDirs) {
    if (!entry.isDirectory()) continue;
    const unitDir = entry.name;
    const unitPath = path.join(apiPath, unitDir);

    for (const file of fs.readdirSync(unitPath, { withFileTypes: true })) {
      if (!file.isFile() || !file.name.endsWith('.js')) continue;
      const methodName = path.basename(file.name, '.js');
      const filePath = path.join(unitPath, file.name);
      try {
        const fn = require(filePath);
        const key = `${unitDir}/${methodName}`;
        methods.set(key, fn);
        logger.log(`Loaded API: ${key}`);
      } catch {
        throw new Error(`Failed to load ${filePath}`);
      }
    }
  }

  return {
    getMethod(unit, ver, method) {
      const exactKey = `${unit}.${ver}/${method}`;
      const fn =
        methods.get(exactKey) ??
        (() => {
          const suffix = `/${method}`;
          const prefix = `${unit}.`;
          for (const [key, f] of methods) {
            if (key.startsWith(prefix) && key.endsWith(suffix)) return f;
          }
          return null;
        })();
      if (!fn) return null;
      return {
        access: fn.access ?? 'public',
        enter: async () => {},
        invoke: (context, args) => fn(context)(args),
        leave: () => {},
      };
    },
  };
};

module.exports = { load };
