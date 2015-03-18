"use strict";

exports.registerDefaultTasks = require('./lib/main').registerTasks;
exports.settings = require('./lib/settings');

// TODO: this is temporarily exposed, you should not need to import this
exports.paths = require('./lib/paths');

// TODO: this is temporarily exposed, you should not need to import this
exports.errorHandler = require('./lib/error-handler');
