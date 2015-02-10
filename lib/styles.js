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
gulp.task('sass:build', function() {
    var options = { };
    if (settings.staticBundle) {
        options.outputStyle = 'compressed';
    } else {
        options.outputStyle = 'nested';

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

// Copies the stylesheets of EpicEditor to proper place
gulp.task('epiceditor-css', function() {
    return gulp.src('./bower_components/epiceditor/epiceditor/**/*.css')
        .pipe(gulp.dest(path.join(paths.build.dest, 'css/epiceditor')))
        .on('error', handleErrors);
});

// Creates a bundle from vendor CSS files
gulp.task('vendor-css', ['epiceditor-css'], function() {
    return gulp.src(paths.vendor.stylesheets)
        .pipe(concatCss("vendor-bundle.css"))
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest(path.join(paths.build.dest, 'css')))
        .on('error', handleErrors);
});

// Copies fonts to proper place
gulp.task('fonts', function() {
    return gulp.src(paths.vendor.fonts)
        .pipe(gulp.dest(path.join(paths.build.dest, 'fonts')))
        .on('error', handleErrors);
});

gulp.task('styles:build', ['sass:build', 'vendor-css', 'fonts']);

gulp.task('styles:watch', ['styles:build'], function() {
    return gulp.watch(paths.sassRoots, ['sass:build']);
});
