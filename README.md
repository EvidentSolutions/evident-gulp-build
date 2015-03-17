evident-gulp-build
==================

Common builds for Angular apps using Browserify, Sass, etc.

Getting started
---------------

For now things are really not configurable at all and the project is not expected to be useful to you.
To use, execute `npm install --save-dev gulp evident-gulp-build` and create `gulpfile.js` with following
configuration:

    var gulp = require('gulp');
    var evidentGulpBuild = require('evident-gulp-build');

    evidentGulpBuild.registerDefaultTasks(gulp);

This will define a bunch of default tasks and you can create additional ones yourself. If you wish to
configure the build, you can adjust the settings of the module, e.g.

    evidentGulpBuild.settings.paths.entryPoint = './src/foo.ts';
    evidentGulpBuild.settings.traceur.enabled = false;
