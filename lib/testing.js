"use strict";

var gulp            = require('./parent-gulp');
var karma           = require('gulp-karma');
var protractor      = require('gulp-protractor').protractor;
var handleErrors    = require('./error-handler');
var defineTask      = require('./define-task');

// Runs JavaScript unit tests
defineTask('test', function() {
    return gulp.src("./test/unit/**/*_spec.js")
        .pipe(karma({
            configFile: 'test/karma.conf.js',
            action: 'run'
        }))
        .on('error', handleErrors);
});

// Runs JavaScript end-to-end tests. Requires that the application and webdriver-manager are running.
defineTask('test-e2e', function() {
    return gulp.src(["./test/e2e/**/*_spec.js"])
        .pipe(protractor({
            configFile: "test/protractor.conf.js"
        }))
        .on('error', handleErrors);
});
