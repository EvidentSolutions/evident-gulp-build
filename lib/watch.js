"use strict";

var gulp     = require('./parent-gulp');

var handleErrors = require('./error-handler');
var defineTask = require('./define-task');

defineTask('watch:internal', ['browserify:watch', 'styles:watch', 'views:watch']);

defineTask('watch', function () {
    handleErrors.exitOnFailure = false;
    return gulp.start(['watch:internal']);
});
