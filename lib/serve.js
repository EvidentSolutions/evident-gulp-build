"use strict";

var parentRequire = require('parent-require');
var gulp            = parentRequire('gulp');
var express         = require('express');
var morgan          = require('morgan');
var path            = require('path');
var livereload      = require('gulp-livereload');
var gutil           = require('gulp-util');
var http            = require('http');

var settings        = require('./settings');
var paths           = require('./paths');
var handleErrors    = require('./error-handler');

// Starts an express server serving the static resources and begins watching changes
gulp.task('serve:internal', function() {
    var app = express();

    app.use(morgan('dev'));
    app.use(settings.indexPagePattern, express.static(path.join(paths.build.dest, 'index.html')));
    app.use(express.static(paths.build.dest));
    app.use(express.static(settings.paths.appRoot));

    //noinspection JSUnresolvedFunction
    http.createServer(app).listen(settings.serve.port).on('error', handleErrors);
    gutil.log("Started development server:", gutil.colors.magenta("http://localhost:" + settings.serve.port + "/"));

    var lrServer = livereload();
    gulp.watch([path.join(paths.build.dest, '**'), paths.templates])
        .on('change', function(file) { lrServer.changed(file.path); })
        .on('error', handleErrors);
});

gulp.task('serve', ['watch'], function() {
    settings.exitOnFailure = false;
    return gulp.start(['serve:internal']);
});

gulp.task('serve:internal:build-bundles', function() {
    settings.staticBundle = true;
    settings.exitOnFailure = false;
    return gulp.start(['browserify:bundle', 'views:build', 'styles:build']);
});

gulp.task('serve:bundle', ['serve:internal:build-bundles'], function () {
    return gulp.start('serve:internal');
});
