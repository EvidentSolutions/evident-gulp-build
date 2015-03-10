"use strict";

var gulp = require('./parent-gulp');
var livereload = require('gulp-livereload');
var path = require('path');

var handleErrors = require('./error-handler');
var defineTask = require('./define-task');
var paths           = require('./paths');

defineTask('watch:internal', ['browserify:watch', 'styles:watch', 'views:watch'], function () {
    return gulp.start(['watch:live-reload']);
});

defineTask('watch:live-reload', function () {
    var lrServer = livereload();
    return gulp.watch([path.join(paths.build.dest, '**'), paths.templates])
        .on('change', function(file) { lrServer.changed(file.path); })
        .on('error', handleErrors);
});

defineTask('watch', function () {
    handleErrors.exitOnFailure = false;
    return gulp.start(['watch:internal']);
});

