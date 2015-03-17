"use strict";

var livereload = require('gulp-livereload');
var path = require('path');

var handleErrors = require('../error-handler');
var paths = require('../paths');
var settings = require('../settings');

exports.registerTasks = function(gulp) {

    gulp.task('watch:internal', ['js:watch', 'css:watch', 'views:watch', 'resources:watch'], function () {
        return gulp.start(['watch:live-reload']);
    });

    gulp.task('watch:live-reload', function () {
        var lrServer = livereload();
        return gulp.watch([path.join(paths.build.dest, '**'), paths.templates])
            .on('change', function (file) {
                lrServer.changed(file.path);
            })
            .on('error', handleErrors);
    });

    gulp.task('watch', function () {
        settings.debug = true;
        handleErrors.exitOnFailure = false;
        return gulp.start(['watch:internal']);
    });
};
