'use strict';

import chalk from 'chalk';

export const log = {
  info: console.log.bind(console, chalk.cyan.bold('cambiasso info:')),
  debug: console.error.bind(console, chalk.bgBlue.whiteBright('cambiasso debug:')),
  error: console.error.bind(console, chalk.magenta.bold('cambiasso error:')),
};


export default log;


