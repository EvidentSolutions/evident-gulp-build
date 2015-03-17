"use strict";

var size            = require('gulp-size');
var templateCache   = require('gulp-angular-templatecache');
var rename          = require('gulp-rename');
var handlebars      = require('gulp-compile-handlebars');
var revall          = require('gulp-rev-all');
var _               = require('lodash');

var settings        = require('../settings');
var handleErrors    = require('../error-handler');
var paths           = require('../paths');

exports.registerTasks = function(gulp) {

    // Compiles handlebars templates to html
    gulp.task('handlebar-templates:build', ['init'], function () {
        var env = _.defaults({}, settings.variables);

        return gulp.src(paths.handlebarsViews)
            .pipe(handlebars(env))
            .pipe(rename(function (path) {
                path.extname = '.html';
            }))
            .pipe(size({title: 'handlebars templates', showFiles: false}))
            .pipe(gulp.dest(paths.build.dest))
            .on('error', handleErrors);
    });

    // Compiles angular templates to a single JavaScript module which populates the template-cache
    gulp.task('angular-templates:build', ['init'], function () {
        var revAllOpts = _.defaults({ignore: '.html', base: settings.paths.appRoot}, settings.revall.options);

        return gulp.src(paths.templates)
            .pipe(revall(revAllOpts))
            .pipe(templateCache('angular-templates.js', {
                'module': 'angular-templates',
                'standalone': true,
                'root': '/'
            }))
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(paths.build.tmp))
            .on('error', handleErrors);
    });

    // Build all templates

    gulp.task('views:watch', ['views:build'], function () {
        return gulp.watch(paths.handlebarsViews, ['handlebar-templates:build']);
    });

    gulp.task('views:build', ['handlebar-templates:build', 'angular-templates:build']);
};
