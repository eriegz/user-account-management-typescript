const tracer = require('tracer');
const clic = require('cli-color');
require('colors'); // Used for the special colour effects below

const conf = {
  format: clic.bold.cyan('{{timestamp}}') + clic.bold.blue(' {{file}}:{{line}}') + ' {{message}}',
  dateformat: 'yyyy-mm-dd - HH:MM:ss',
  filters: {
    // log:     clic.blue,
    trace: clic.magentaBright,
    debug: clic.cyanBright.bold.bgXterm(232),
    // info:   clic.greenBright,
    warn: clic.yellow,
    error: clic.red.bold,
  },
  level: 3,
};

module.exports = tracer.colorConsole(conf);
