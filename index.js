#!/usr/bin/env node
'use strict';

const program = require('commander');
const app = require('./app');

program
  .version('1.0.0')
  .description('PHPMyAdmin/Mysql Docker Launcher');

program
  .command('startApp', {isDefault: true})
  .alias('start')
  .description('Start app')
  .action(() => {
    app.startApp();
  });

program.parse(process.argv);