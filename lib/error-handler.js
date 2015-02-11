"use strict";

var notify = require('gulp-notify');

function handleErrors() {
    /*jshint validthis:true */

    notify.onError({ title: "Build Error", message: "<%= error.message %>"}).apply(this, arguments);

    if (handleErrors.exitOnFailure) {
        process.exit(1);
    }

    // Keep gulp from hanging on this task
    this.emit('end');
}

handleErrors.exitOnFailure = true;
module.exports = handleErrors;
