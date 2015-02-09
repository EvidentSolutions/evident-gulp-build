evident-gulp-build
==================

Common builds for Angular apps using Browserify, Sass, etc.

Getting started
---------------

For now things are really not configurable at all and the project is not expected to be useful to you.
To use, execute `npm install -save-dev gulp evident-gulp-build` and create `gulpfile.js` with following
configuration:

    var gulp = require('gulp');
    var evidentBuild = require('evident-gulp-build');
    evidentBuild.register(gulp);
