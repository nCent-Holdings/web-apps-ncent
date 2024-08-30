const logger = {
  setLevel(level) {
    this._disableDebug = level !== 'debug';
  },
  verbose(...args) {
    console.log('\x1b[100m', ...args, '\x1b[0m', '\n');
  },
  info(...args) {
    console.log(...args, '\n');
  },
  log(...args) {
    console.log(...args);
  },
  debug(...args) {
    console.log('\x1b[90m', ...args, '\x1b[0m');
  },
  success(...args) {
    console.log('\x1b[42m', ...args, '\x1b[0m');
  },
};

module.exports = logger;
