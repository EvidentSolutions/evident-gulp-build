"use strict";

var express         = require('express');
var morgan          = require('morgan');
var path            = require('path');
var gutil           = require('gulp-util');
var http            = require('http');

var settings        = require('../settings');
var paths           = require('../paths');
var handleErrors    = require('../error-handler');

exports.registerTasks = function (gulp) {

    // Starts an express server serving the static resources and begins watching changes
    gulp.task('egb:serve', ['watch'], function(cb) {
        var app = express();

        app.use(morgan('dev'));
        app.use(settings.serve.indexPagePattern, express.static(path.join(paths.build.dest, 'index.html')));
        app.use(express.static(paths.build.dest));
        app.use(express.static(paths.appRoot));

        http.createServer(app)
            .listen(settings.serve.port)
            .on('error', handleErrors);

        gutil.log("Started development server:", gutil.colors.magenta("http://localhost:" + settings.serve.port + "/"));
        cb();
    });
};
