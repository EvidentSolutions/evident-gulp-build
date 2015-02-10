evident-gulp-build
==================

Common builds for Angular apps using Browserify, Sass, etc.

Getting started
---------------

For now things are really not configurable at all and the project is not expected to be useful to you.
To use, execute `npm install --save-dev gulp evident-gulp-build` and create `gulpfile.js` with following
configuration:

    require('evident-gulp-build');

This will define a bunch of default tasks and you can create additional ones yourself. If you wish to
configure the build, you can adjust the settings of the module, e.g.

    var settings = require('evident-gulp-build').settings;
    settings.serve.port = 4000;
