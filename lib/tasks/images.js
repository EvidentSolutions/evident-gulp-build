"use strict";

var paths = require('../paths');
var errorHandler = require('../error-handler');

exports.registerTasks = function (gulp) {
    gulp.task('egb:images:copy-images', function() {
        return gulp.src(paths.imageRoots)
            .pipe(gulp.dest(paths.build.dest))
            .on('error', errorHandler);
    });

    gulp.task('egb:images:build', ['egb:images:copy-images']);

    gulp.task('egb:images:watch', ['egb:images:build'], function() {
        return gulp.watch(paths.imageRoots, ['egb:images:copy-images']);
    });
};