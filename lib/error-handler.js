"use strict";

var notify = require('gulp-notify');
var settings = require('./settings');

module.exports = function handleErrors() {
    /*jshint validthis:true */
    // Send error to notification center with gulp-notify
    notify.onError({
        title: "Build Error",
        message: "<%= error.message %>"
    }).apply(this, arguments);

    if (settings.exitOnFailure) {
        process.exit(1);
    }

    // Keep gulp from hanging on this task
    //noinspection JSHint
    this.emit('end');
};
