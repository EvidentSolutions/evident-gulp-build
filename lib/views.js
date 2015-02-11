"use strict";

var gulp            = require('./parent-gulp');
var size            = require('gulp-size');
var templateCache   = require('gulp-angular-templatecache');
var rename          = require('gulp-rename');
var handlebars      = require('gulp-compile-handlebars');
var _               = require('lodash');

var settings        = require('./settings');
var handleErrors    = require('./error-handler');
var paths           = require('./paths');
var defineTask      = require('./define-task');

// Compiles handlebars templates to html
defineTask('handlebar-templates:build', function() {
    var env = _.defaults({}, settings.variables, { staticBundle: settings.staticBundle });

    return gulp.src(paths.handlebarsViews)
        .pipe(handlebars(env))
        .pipe(rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(size({title: 'handlebars templates', showFiles: false}))
        .pipe(gulp.dest(paths.build.dest))
        .on('error', handleErrors);
});

// Compiles angular templates to a single JavaScript module which populates the template-cache
defineTask('angular-templates:build', function () {
    return gulp.src(paths.templates)
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

defineTask('views:watch', ['views:build'], function() {
    return gulp.watch(paths.handlebarsViews, ['handlebar-templates:build']);
});

defineTask('views:build', ['handlebar-templates:build', 'angular-templates:build']);
