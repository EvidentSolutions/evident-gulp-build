"use strict";

var path = require('path');
var paths = require('../paths');
var settings = require('../settings');
var errorHandler = require('../error-handler');

exports.registerTasks = function (gulp) {

    gulp.task('egb:resources:build', ['egb:resources:copy-fonts']);

    gulp.task('egb:resources:watch', ['egb:resources:build']);

    gulp.task('egb:resources:copy-fonts', function() {
        return gulp.src(settings.fonts.vendorFonts)
            .pipe(gulp.dest(path.join(paths.build.dest, 'fonts')))
            .on('error', errorHandler);
    });
};
