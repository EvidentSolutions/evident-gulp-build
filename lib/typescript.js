"use strict";

var gulp = require('./parent-gulp');
var tsd = require('gulp-tsd');
var defineTask = require('./define-task');

defineTask('tsd', function (callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});
