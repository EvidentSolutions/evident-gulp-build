"use strict";

// Options for development server
exports.serve = {
    port: 3000,
    indexPagePattern: /^\/$/
};

// Variables exposed to Handlebars and Javascript
exports.variables = {
};

exports.css = {
    vendorStylesheets: [],
    autoprefixer: { }
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

exports.revall = {
    options: {
        quiet: true,
        ignore: [/^\/favicon.ico$/g, /^\/index.html/g]
    }
};

// TODO: internal, temporary setting. don't use this
exports.debug = false;
