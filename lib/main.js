"use strict";

exports.registerTasks = function(gulp) {
    require('./tasks/core').registerTasks(gulp);
    require('./tasks/js-build').registerTasks(gulp);
    require('./tasks/resources').registerTasks(gulp);
    require('./tasks/serve').registerTasks(gulp);
    require('./tasks/css').registerTasks(gulp);
    require('./tasks/testing').registerTasks(gulp);
    require('./tasks/typescript').registerTasks(gulp);
    require('./tasks/views').registerTasks(gulp);
    require('./tasks/watch').registerTasks(gulp);
    require('./tasks/images').registerTasks(gulp);

    gulp.task('build', ['egb:build']);
    gulp.task('watch', ['egb:watch']);
};
