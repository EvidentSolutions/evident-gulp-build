"use strict";

var tsd = require('gulp-tsd');

exports.registerTasks = function(gulp) {
    gulp.task('typescript:tsd', function (callback) {
        tsd({
            command: 'reinstall',
            config: './tsd.json'
        }, callback);
    });
};
