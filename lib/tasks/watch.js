"use strict";

var livereload = require('gulp-livereload');
var path = require('path');

var handleErrors = require('../error-handler');
var paths = require('../paths');
var settings = require('../settings');

exports.registerTasks = function(gulp) {

    gulp.task('egb:watch:internal', ['egb:js:watch', 'egb:css:watch', 'egb:views:watch', 'egb:resources:watch'], function () {
        return gulp.start(['egb:watch:live-reload']);
    });

    gulp.task('egb:watch:live-reload', function () {
        livereload.listen();
        return gulp.watch([path.join(paths.build.dest, '**'), paths.templates])
            .on('change', function (file) {
                livereload.changed(file.path);
            })
            .on('error', handleErrors);
    });

    gulp.task('egb:watch', function () {
        settings.debug = true;
        handleErrors.exitOnFailure = false;
        return gulp.start(['egb:watch:internal']);
    });
};
