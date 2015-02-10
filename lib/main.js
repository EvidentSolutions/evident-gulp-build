"use strict";

var gulp     = require('parent-require')('gulp');
var del      = require('del');

require('./browserify-compile');
require('./serve');
require('./styles');
require('./testing');
require('./views');

// TODO: add support for creating bundles with hash file names using gulp-rev-all

var settings = require('./settings');

gulp.task('build', ['browserify:bundle', 'styles:build', 'views:build']);

gulp.task('watch', ['browserify:watch', 'styles:watch', 'views:watch']);

gulp.task('clean', function (cb) {
    del(settings.paths.output, cb);
});

gulp.task('default', ['clean'], function () {
    return gulp.start('serve');
});
