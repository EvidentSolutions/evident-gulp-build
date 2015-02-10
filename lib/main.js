"use strict";

var gulp            = require('parent-require')('gulp');
var del             = require('del');
var path            = require('path');
var revall          = require('gulp-rev-all');

var settings        = require('./settings');
var handleErrors    = require('./error-handler');
var paths           = require('./paths');

require('./browserify-compile');
require('./serve');
require('./styles');
require('./testing');
require('./views');

// Starts watching for changes
gulp.task('watch', ['compile:watch', 'styles:watch', 'views:watch']);

// Cleans everything built
gulp.task('clean', function (cb) {
    del(settings.paths.output, cb);
});

// Builds everything
gulp.task('build', ['compile:bundle', 'styles:build', 'views:build']);

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
