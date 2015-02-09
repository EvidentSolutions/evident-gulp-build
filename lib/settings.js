"use strict";

exports.indexPagePattern = /^\/$/;
exports.exitOnFailure = true;
exports.staticBundle = false;

exports.serve = {
    port: 3000
};

exports.paths = {
    output: './build/gulp',
    templates: './src'
};
