const prompt = require('prompt');
const colors = require("colors/safe");
const util = require('util');

const asyncPrompt = require('./lib/async-prompt').asyncPrompt;
const createDk = require('./lib/create-docker');
const startDk = require('./lib/start-docker');
const stopDk = require('./lib/stop-docker');

async function startApp() {
  prompt.message = '';
  prompt.start();
  let keep = true;

  while (keep) {
    prompt.delimiter = colors.green(" >");

    console.log(colors.yellow.underline('\nChoose an action :\n'));
    console.log(colors.yellow.bold('1 : Create docker'));
    console.log(colors.yellow.bold('2 : Start docker'));
    console.log(colors.yellow.bold('3 : Stop docker'));
    console.log(colors.yellow.bold('0 : Exit'));
    console.log('');

    const userChoice = await asyncPrompt(['action']);

    switch (userChoice.action) {
      case '0': prompt.stop(); keep = false; break;
      case '1':
        await createDk.createDocker();
        break;
      case '2':
        await startDk.startDocker();
        break;
      case '3':
        await stopDk.stopDocker();
        break;
      default: console.log("No action selected, bye!!"); keep = false;
    }
  }
  prompt.stop();
};

module.exports = {
  startApp,
};
