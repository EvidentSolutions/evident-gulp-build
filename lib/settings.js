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
    paths: ['**/*.png', '**/*.jpeg', '**/*.jpg', '**/*.gif']
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

exports.hbs = {
    handlebarsPartialsPath: './view-partials'
};

// TODO: internal, temporary setting. don't use this
exports.debug = false;
