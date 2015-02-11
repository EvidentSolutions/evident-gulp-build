"use strict";

// Options for development server
exports.serve = {
    port: 3000,
    indexPagePattern: /^\/$/
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

// TODO: internal, temporary setting. don't use this
exports.staticBundle = false;

// TODO: internal, temporary setting. don't use this
exports.minimized = false;
