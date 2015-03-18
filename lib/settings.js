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
        ignore: [/^index.html$/]
    }
};

// TODO: internal, temporary setting. don't use this
exports.debug = false;
