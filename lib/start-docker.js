const colors = require("colors/safe");
const asyncPrompt = require('./async-prompt').asyncPrompt;
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function startDocker() {
  const isDirectory = source => lstatSync(source).isDirectory();
  const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory).filter(name => name.startsWith('dk_'));
  const folders = getDirectories('./');

  console.log(colors.green.underline('\nChoose your docker to start :'));
  for (let i = 0; i < folders.length; i++) {
    const folderName = folders[i].split('dk_')[1];
    console.log(colors.green.bold(`${i + 1} : ${folderName}`));
  }
  console.log(colors.green.bold('0 : Back to menu'));
  console.log('');

  const dirDocker = await asyncPrompt(['action']);
  if (dirDocker.action !== '0') {
    const fileName = `./${folders[dirDocker.action - 1]}/docker-compose.yml`;
    try {
      console.log('');
      console.log(colors.green.italic('Mounting docker ...'));
      await exec(`docker-compose -f "${fileName}" up -d`);
      console.log(colors.green.italic('Docker Up !'));
    } catch(e) {
      console.log(colors.red('Error: ', e.stderr));
      console.log(colors.red('Abort action, back to menu...'));
    }
  }
};

return module.exports = {
  startDocker,
};

