"use strict";

var path = require('path');
var paths = require('../paths');
var settings = require('../settings');
var errorHandler = require('../error-handler');

exports.registerTasks = function (gulp) {

    gulp.task('egb:resources:build', ['egb:resources:copy-fonts', 'egb:resources:copy']);

    gulp.task('egb:resources:watch', ['egb:resources:build']);

    gulp.task('egb:resources:copy-fonts', function() {
        return gulp.src(settings.fonts.vendorFonts)
            .pipe(gulp.dest(path.join(paths.build.dest, 'fonts')))
            .on('error', errorHandler);
    });

    gulp.task('egb:resources:copy', function() {
        return gulp.src(settings.resources.paths.map(function (p) { return path.join(paths.appRoot, p); }))
                .pipe(gulp.dest(paths.build.dest))
                .on('error', errorHandler);
    });
};
