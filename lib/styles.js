"use strict";

var gulp = require('parent-require')('gulp');
var sass = require('gulp-sass');
var size = require('gulp-size');
var path = require('path');
var concatCss = require('gulp-concat-css');

var settings = require('./settings');
var paths = require('./paths');
var handleErrors = require('./error-handler');

// Compiles Sass stylesheets to CSS
gulp.task('styles:build:sass', function() {
    var options = { };
    if (settings.staticBundle) {
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
        .pipe(gulp.dest(paths.build.dest))
        .on('error', handleErrors);
});

gulp.task('styles:build', ['styles:build:sass', 'styles:vendor-bundle:build', 'styles:copy-extra-resources']);

gulp.task('styles:watch', ['styles:build'], function() {
    return gulp.watch(paths.sassRoots, ['styles:build:sass']);
});
