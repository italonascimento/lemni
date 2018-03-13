#!/usr/bin/env node

import * as commander from 'commander'

const { version } = require('../package.json')

commander
  .version(version)
  .command('start <project>', 'Start a new Lemni project')
  .parse(process.argv)
