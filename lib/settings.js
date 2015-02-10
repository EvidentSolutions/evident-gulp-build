"use strict";

exports.indexPagePattern = /^\/$/;
exports.exitOnFailure = true;
exports.staticBundle = false;

exports.serve = {
    port: 3000
};

exports.paths = {
    entryPoint: './app/js/main.js',
    output: './build/gulp',
    appRoot: './app',
    viewRoot: './views',
    vendorStylesheets: []
};

exports.traceur = {
    enabled: true
};

exports.typescript = {
    enabled: true,
    flags: {
        noImplicitAny: true,
        target: 'ES5'
    }
};
