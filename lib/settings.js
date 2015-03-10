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
    entryPoint: './app/main.js',
    output: './build/gulp',
    appRoot: './app',
    viewRoot: './views',
    vendorStylesheets: []
};

exports.optimize = {
    gzippedFileExtensions: ["js", "css", "html"]
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

exports.autoprefixer = {
};

exports.revall = {
    options: {
        ignore: [/^index.html$/]
    }
};

// TODO: internal, temporary setting. don't use this
exports.staticBundle = false;

// TODO: internal, temporary setting. don't use this
exports.minimized = false;
