"use strict";

exports.registerTasks = function(gulp) {
    require('./tasks/core').registerTasks(gulp);
    require('./tasks/browserify-compile').registerTasks(gulp);
    require('./tasks/serve').registerTasks(gulp);
    require('./tasks/styles').registerTasks(gulp);
    require('./tasks/testing').registerTasks(gulp);
    require('./tasks/typescript').registerTasks(gulp);
    require('./tasks/views').registerTasks(gulp);
    require('./tasks/watch').registerTasks(gulp);
};
