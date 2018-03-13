#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const { version } = require('../package.json');
commander
    .version(version)
    .command('start <project>', 'Start a new Lemni project')
    .parse(process.argv);
//# sourceMappingURL=lemni.js.map