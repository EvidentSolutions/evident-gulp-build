"use strict";

var path = require('path');

var outputPath = './build/egb';

module.exports = {
    output: outputPath,
    appRoot: './app',
    sassRoots: ['./app/**/*.sass', './app/**/*.scss'],
    templates: ['./app/**/*.html'],
    entryPointCandidates: ['./app/main.js', './app/main.ts'],
    handlebarsViews: './views/**/*.hbs',
    imageRoots: ['./app/**/*.png', './app/**/*.jpeg', './app/**/*.jpg', './app/**/*.gif'],
    build: {
        get dest() { return path.join(outputPath, 'static'); },
        get optimized() { return path.join(outputPath, 'optimized'); },
        get tmp() { return path.join(outputPath, 'tmp'); }
    }
};
