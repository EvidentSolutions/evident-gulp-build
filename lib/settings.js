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

exports.fonts = {
    vendorFonts: []
};

exports.resources = {
    paths: ['./app/**/*.png', './app/**/*.jpeg', './app/**/*.jpg', './app/**/*.gif']
};

exports.optimize = {
    gzippedFileExtensions: ["js", "css", "html"]
};

exports.browserify = {
    ignoredExternalLibraries: []
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
        dontRenameFile: [/^\/favicon.ico$/g, /^\/index.html/g],
        dontSearchFile: [/^.+\.js$/g]
    }
};

// TODO: internal, temporary setting. don't use this
exports.debug = false;
