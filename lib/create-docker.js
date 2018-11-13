const prompt = require('prompt');
const colors = require("colors/safe");
const { writeFile } = require('fs');
const { promisify } = require('util');

const exec = promisify(require('child_process').exec);
const writeFileSync = promisify(writeFile);
const fileName = 'docker-compose.yml';

const asyncPrompt = require('./async-prompt').asyncPrompt;

async function createDocker() {
  console.log(colors.yellow.underline('\nDirectory Configuration :'));
  const dirConfig = await asyncPrompt(['Name']);
  const dirName = `dk_${dirConfig.Name}`;

  try {
    await exec(`mkdir ${dirName}`);
  } catch (e) {
    console.log(colors.red.italic('Error: ', e.stderr));
    console.log(colors.red.italic('Back to menu...'));
    return;
  }

  console.log(colors.green.underline('\nDatabase Configuration :'));
  const dbConfig = await asyncPrompt(['Name', 'User', 'Password', 'Port']);

  prompt.delimiter = colors.red(" >");

  console.log(colors.red.underline('\nPHPMyAdmin Configuration :'));
  const pmConfig = await asyncPrompt(['Port']);

  console.log(colors.blue.italic('\nCreating the docker-compose.yml...'));

  const fileContent = 'version: "2"'
    + '\n\n'
    + 'services:'
    + '\n  db:'
    + '\n    image: mysql'
    + '\n    command: --default-authentication-plugin=mysql_native_password'
    + '\n    environment:'
    + `\n      - MYSQL_DATABASE=${dbConfig.Name}`
    + `\n      - MYSQL_USER=${dbConfig.User}`
    + `\n      - MYSQL_PASSWORD=${dbConfig.Password}`
    + '\n      - MYSQL_ROOT_PASSWORD=root'
    + '\n    volumes:'
    + '\n      - ./db:/var/lib/mysql'
    + '\n    ports:'
    + `\n      - "${dbConfig.Port}:3306"`
    + '\n  phpmyadmin:'
    + '\n    image: phpmyadmin/phpmyadmin'
    + '\n    environment:'
    + '\n      - PMA_ARBITRARY=1'
    + `\n      - MYSQL_USER=${dbConfig.User}`
    + `\n      - MYSQL_PASSWORD=${dbConfig.Password}`
    + '\n      - MYSQL_ROOT_PASSWORD=root'
    + '\n    ports:'
    + `\n      - "${pmConfig.Port}:80"`
    + '\n    links:'
    + '\n      # for mysql container'
    + '\n      - "db:db"'
    + '\n    depends_on:'
    + '\n      - db'
    + '\nvolumes:'
    + '\n    db:'
    + '\n\      driver: "local"';

  try {
    await writeFileSync(`./${dirName}/${fileName}`, fileContent);
    console.log(colors.blue.italic('The file was succesfully created.'));
    console.log(colors.blue.italic('Back to menu...'));
  } catch (e) {
    console.log(colors.red.italic('Error : ', e));
    console.log(colors.red.italic('Abort creating file.'));
    console.log('');

    try {
      console.log(colors.red.italic(`Remove folder ${dirName}...`));
      await exec(`rmdir ${dirName}`);
      console.log(colors.red.italic('Folder Removed'));
    } catch (e) {
      console.log(colors.red.italic('Error: ', e.stderr));
    } finally {
      console.log(colors.red.italic('Back to menu...'));
    }
  }
}

module.exports = {
  createDocker,
};





