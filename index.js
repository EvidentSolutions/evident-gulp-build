"use strict";

var gulp = require('parent-require')('gulp');

require('./lib/main').registerTasks(gulp);

exports.settings = require('./lib/settings');
exports.errorHandler = require('./lib/error-handler');
