"use strict";

var del      = require('del');
var path     = require('path');
var revall   = require('gulp-rev-all');
var gzip     = require('gulp-gzip');
var size     = require('gulp-size');
var git      = require('gulp-git');

var settings = require('../settings');

exports.registerTasks = function (gulp) {

    gulp.task('build', ['build:static']);

    gulp.task('build:static', ['browserify:build', 'styles:build', 'views:build']);

    gulp.task('build:optimized', ['build:static'], function () {
        return gulp.src(path.join(settings.paths.output, 'static/**'))
            .pipe(revall(settings.revall.options))
            .pipe(gulp.dest(path.join(settings.paths.output, 'optimized')));
    });

    gulp.task('build:gzip', ['build:optimized'], function () {
        var dir = path.join(settings.paths.output, 'optimized');
        return gulp.src(settings.optimize.gzippedFileExtensions.map(function (ext) {
            return path.join(dir, '**/*.' + ext);
        }))
            .pipe(gzip())
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(dir));
    });

    gulp.task('init', ['init:scm-version']);

    gulp.task('init:scm-version', function (cb) {
        git.revParse({args: '--short HEAD'}, function (err, hash) {
            if (err) {
                console.log('could not initialize git version info');
                cb();
                return;
            }

            settings.variables.version = hash;
            cb();
        });
    });

    gulp.task('clean', function (cb) {
        del(settings.paths.output, cb);
    });

    gulp.task('default', ['clean'], function () {
        return gulp.start('serve');
    });
};
