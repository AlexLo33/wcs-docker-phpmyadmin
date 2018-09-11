const colors = require("colors/safe");
const asyncPrompt = require('./async-prompt').asyncPrompt;
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function stopDocker() {
  const isDirectory = source => lstatSync(source).isDirectory();
  const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory).filter(name => name.startsWith('dk_'));
  const folders = getDirectories('./');

  console.log(colors.green.underline('\nChoose your docker to stop :'));
  for (let i = 1; i <= folders.length; i++) {
    const folderName = folders[i - 1].split('dk_')[1];
    console.log(colors.green.bold(`${i} : ${folderName}`));
  }
  console.log(colors.green.bold('0 : Back to menu'));
  console.log('');

  const dirDocker = await asyncPrompt(['action']);
  if (dirDocker.action !== '0') {
    const fileName = `./${folders[dirDocker.action - 1]}/docker-compose.yml`;

    try {
      console.log('');
      console.log(colors.blue.italic('Unmounting docker ...'));
      await exec(`docker-compose -f "${fileName}" down`);
      console.log(colors.blue.italic('Docker Down !'));
    } catch(e) {
      console.log(colors.red('Error: ', e.stderr));
      console.log(colors.red('Abort action, back to menu...'));
    }
  }
};

return module.exports = {
  stopDocker,
};