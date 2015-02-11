"use strict";

var gulp = require('./parent-gulp');

module.exports = function defineTask(name, dependencies, body) {
    if (dependencies instanceof Function) {
        body = dependencies;
        dependencies = [];
    }

    return gulp.task(name, dependencies, body);
};
