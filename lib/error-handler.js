"use strict";

var notify = require('gulp-notify');
var settings = require('./settings');

module.exports = function handleErrors() {
    notify.onError({ title: "Build Error", message: "<%= error.message %>"}).apply(this, arguments);

    if (settings.exitOnFailure) {
        process.exit(1);
    }

    // Keep gulp from hanging on this task
    this.emit('end');
};
