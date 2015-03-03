"use strict";

var gulp     = require('./parent-gulp');
var del      = require('del');
var path     = require('path');
var revall   = require('gulp-rev-all');
var gzip     = require('gulp-gzip');
var size     = require('gulp-size');

var defineTask = require('./define-task');
require('./browserify-compile');
require('./serve');
require('./styles');
require('./testing');
require('./views');

var settings = require('./settings');

defineTask('build', ['build:static']);

defineTask('build:static', ['browserify:bundle', 'styles:build', 'views:build']);

defineTask('build:optimized', ['build:static'], function () {
    return gulp.src(path.join(settings.paths.output, 'static/**'))
        .pipe(revall(settings.revall.options))
        .pipe(gulp.dest(path.join(settings.paths.output, 'optimized')));
});

defineTask('build:gzip', ['build:optimized'], function() {
    var dir = path.join(settings.paths.output, 'optimized');
    return gulp.src(settings.optimize.gzippedFileExtensions.map(function(ext) { return path.join(dir, '**/*.' + ext); }))
        .pipe(gzip())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest(dir));
});

defineTask('watch', ['browserify:watch', 'styles:watch', 'views:watch']);

defineTask('clean', function (cb) {
    del(settings.paths.output, cb);
});

defineTask('default', ['clean'], function () {
    return gulp.start('serve');
});
