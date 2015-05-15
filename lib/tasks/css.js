"use strict";

var sass = require('gulp-sass');
var path = require('path');
var size = require('gulp-size');
var concatCss = require('gulp-concat-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var csslint = require('gulp-csslint');
var settings = require('../settings');
var paths = require('../paths');
var handleErrors = require('../error-handler');

exports.registerTasks = function (gulp) {

    // Compiles Sass stylesheets to CSS
    gulp.task('egb:css:sass:build', function() {
        var options = { };
        if (!settings.debug) {
            options.outputStyle = 'compressed';
        } else {
            options.outputStyle = 'nested';

            // TODO: check if this can be removed already
            if (process.platform !== 'win32') {
                // Source maps are broken on Windows. See https://github.com/dlmanning/gulp-sass/issues/28
                options.sourceComments = 'map';
            }
        }

        return gulp.src(paths.sassRoots)
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(sass(options))
            .pipe(autoprefixer(settings.css.autoprefixer))
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(paths.build.dest))
            .on('error', handleErrors);
    });

    // Creates a bundle from vendor CSS files
    gulp.task('egb:css:vendor:build', function() {
        return gulp.src(settings.css.vendorStylesheets)
            .pipe(concatCss("vendor.css", { rebaseUrls: false }))
            .pipe(csslint())
            .pipe(csslint.reporter(egbCssReporter))
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(path.join(paths.build.dest, 'css')))
            .on('error', handleErrors);
    });

    gulp.task('egb:css:build', ['egb:css:sass:build', 'egb:css:vendor:build']);

    gulp.task('egb:css:watch', ['egb:css:build'], function() {
        return gulp.watch(paths.sassRoots, ['egb:css:sass:build']);
    });
};

function egbCssReporter(file) {
    return file.csslint.results.forEach(function(result) {
        if (result.error.message.indexOf("@charset not allowed here") !== -1) {
            // We ignore @charset problems for now.
            // @charset error happens because of concating files into one file, and
            // thus multiple @charsets are included in one file.
            gutil.log("CSS lint warning:", result.error.message, "[ line =", result.error.line, "]");
        } else if (result.error.rule.name.indexOf("Parsing Error") !== -1) {
            gutil.log("CSS lint error:", result.error.message, "[ line =", result.error.line, "]");
            throw new gutil.PluginError({
                plugin: "verifyCss",
                message: 'css parsing error: ' + result.error.message,
                lineNumber: result.error.line,
                fileName: file.path
            });
        }
    });
}