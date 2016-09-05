#!/usr/bin/env node

var lib = require('../lib/viewmodel.js');
var userArgs = process.argv.slice(2);
lib.createViewModel(userArgs);