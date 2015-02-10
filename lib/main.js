"use strict";

var gulp            = require('parent-require')('gulp');
var del             = require('del');
var path            = require('path');
var size            = require('gulp-size');
var templateCache   = require('gulp-angular-templatecache');
var rename          = require("gulp-rename");
var handlebars      = require('gulp-compile-handlebars');
var revall          = require('gulp-rev-all');

var settings        = require('./settings');
var handleErrors    = require('./error-handler');
var paths           = require('./paths');

require('./browserify-compile');
require('./serve');
require('./styles');
require('./testing');

// Starts watching for changes
gulp.task('watch', ['compile:watch', 'styles', 'templates'], function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.views, ['compile-views']);
});

// Compiles handlebars templates to html
gulp.task('compile-views', function() {
    return gulp.src(paths.views)
        .pipe(handlebars({ staticBundle: settings.staticBundle }))
        .pipe(rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(paths.build.dest))
        .on('error', handleErrors);
});

// Compiles angular templates to a single JavaScript module which populates the template-cache
gulp.task('compile-angular-templates', function () {
    return gulp.src(paths.templates)
        .pipe(templateCache('angular-templates.js', {
            'module': 'angular-templates',
            'standalone': true,
            'root': '/'
        }))
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest(paths.build.tmp))
        .on('error', handleErrors);
});

// Build all templates
gulp.task('templates', ['compile-views', 'compile-angular-templates']);

// Cleans everything built
gulp.task('clean', function (cb) {
    del(settings.paths.output, cb);
});

// Builds everything
gulp.task('build', ['compile:bundle', 'styles', 'templates']);

// Create an optimized build
gulp.task('build-optimized', ['build'], function() {
    return gulp.src(path.join(paths.build.dest, '**'))
        .pipe(revall({ ignore: [/^index.html$/, /^css\/epiceditor\/.+/] }))
        .pipe(gulp.dest(path.join(settings.paths.output, 'optimized')));
});

// Creates a production build
gulp.task('build-production', ['clean'], function() {
    settings.staticBundle = true;
    gulp.start('build-optimized');
});

// Creates a development build
gulp.task('build-development', ['clean'], function() {
    settings.staticBundle = false;
    gulp.start('build');
});


// By default, clean everything built and start local server
gulp.task('default', ['clean'], function () {
    gulp.start('serve');
});
