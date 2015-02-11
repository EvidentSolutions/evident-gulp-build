"use strict";

var gulp     = require('parent-require')('gulp');
var del      = require('del');

var defineTask = require('./define-task');
require('./browserify-compile');
require('./serve');
require('./styles');
require('./testing');
require('./views');

// TODO: add support for creating bundles with hash file names using gulp-rev-all

var settings = require('./settings');

defineTask('build', ['browserify:bundle', 'styles:build', 'views:build']);

defineTask('watch', ['browserify:watch', 'styles:watch', 'views:watch']);

defineTask('clean', function (cb) {
    del(settings.paths.output, cb);
});

defineTask('default', ['clean'], function () {
    return gulp.start('serve');
});
