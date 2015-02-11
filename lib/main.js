"use strict";

var gulp     = require('./parent-gulp');
var del      = require('del');
var revall   = require('gulp-rev-all');
var path     = require('path');

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
        .pipe(revall({ ignore: [/^index.html$/] }))
        .pipe(gulp.dest(path.join(settings.paths.output, 'optimized')));
});

defineTask('watch', ['browserify:watch', 'styles:watch', 'views:watch']);

defineTask('clean', function (cb) {
    del(settings.paths.output, cb);
});

defineTask('default', ['clean'], function () {
    return gulp.start('serve');
});
