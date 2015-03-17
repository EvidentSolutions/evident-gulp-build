"use strict";

var sass = require('gulp-sass');
var path = require('path');
var size = require('gulp-size');
var concatCss = require('gulp-concat-css');
var autoprefixer = require('gulp-autoprefixer');

var settings = require('./settings');
var paths = require('./paths');
var handleErrors = require('./error-handler');

exports.registerTasks = function (gulp) {

    // Compiles Sass stylesheets to CSS
    gulp.task('styles:build:sass', function() {
        var options = { };
        if (!settings.debug) {
            options.outputStyle = 'compressed';
        } else {
            options.outputStyle = 'nested';

            // TODO: check if this can be removed already
            if (process.platform !== 'win32') {
                // Source maps are broken on Windows. See https://github.com/dlmanning/gulp-sass/issues/28
                options.sourceComments = 'map';
            }
        }

        return gulp.src(paths.sassRoots)
            .pipe(sass(options))
            .pipe(autoprefixer(settings.autoprefixer))
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(paths.build.dest))
            .on('error', handleErrors);
    });

    gulp.task('styles:copy-extra-resources');

    // Creates a bundle from vendor CSS files
    gulp.task('styles:vendor-bundle:build', function() {
        return gulp.src(settings.paths.vendorStylesheets)
            .pipe(concatCss("vendor-bundle.css"))
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(path.join(paths.build.dest, 'css')))
            .on('error', handleErrors);
    });

    gulp.task('styles:build', ['styles:build:sass', 'styles:vendor-bundle:build', 'styles:copy-extra-resources']);

    gulp.task('styles:watch', ['styles:build'], function() {
        return gulp.watch(paths.sassRoots, ['styles:build:sass']);
    });
};
