"use strict";

exports.indexPagePattern = /^\/$/;
exports.staticBundle = false;

exports.serve = {
    port: 3000
};

// Variables exposed to Handlebars and Javascript
exports.variables = {
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
