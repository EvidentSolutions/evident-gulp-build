"use strict";

var del      = require('del');
var path     = require('path');
var RevAll   = require('gulp-rev-all');
var gzip     = require('gulp-gzip');
var size     = require('gulp-size');
var git      = require('gulp-git');
var gutil    = require('gulp-util');

var settings = require('../settings');
var paths = require('../paths');

exports.registerTasks = function (gulp) {

    gulp.task('egb:build', ['egb:build:gzip']);

    gulp.task('egb:build:static', ['egb:js:build', 'egb:css:build', 'egb:views:build', 'egb:resources:build', 'egb:images:build']);

    gulp.task('egb:build:optimized', ['egb:build:static'], function () {
        var revAllOptions = settings.revall.options;
        if (revAllOptions.ignore) {
            gutil.log("Using deprecated 'revall.options.ignore'. Use 'revall.options.dontRenameFile' instead.");
            revAllOptions.dontRenameFile = revAllOptions.ignore;
        }

        var revall = new RevAll(revAllOptions);
        return gulp.src(path.join(paths.build.dest, '**'))
            .pipe(revall.revision())
            .pipe(gulp.dest(paths.build.optimized));
    });

    gulp.task('egb:build:gzip', ['egb:build:optimized'], function () {
        var files = settings.optimize.gzippedFileExtensions.map(function (ext) {
            return path.join(paths.build.optimized, '**/*.' + ext);
        });

        return gulp.src(files)
            .pipe(gzip())
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(paths.build.optimized));
    });

    gulp.task('egb:init', ['egb:init:scm-version']);

    gulp.task('egb:init:scm-version', function (cb) {
        git.revParse({args: '--short HEAD'}, function (err, hash) {
            if (err) {
                console.log('could not initialize git version info');
                cb();
                return;
            }

            settings.variables.EGB_SCM_VERSION = hash;
            cb();
        });
    });

    gulp.task('egb:clean', function (cb) {
        del(paths.output, cb);
    });
};
