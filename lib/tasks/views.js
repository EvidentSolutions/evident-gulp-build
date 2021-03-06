"use strict";

var size            = require('gulp-size');
var templateCache   = require('gulp-angular-templatecache');
var rename          = require('gulp-rename');
var handlebars      = require('gulp-compile-handlebars');
var RevAll          = require('gulp-rev-all');
var _               = require('lodash');

var settings        = require('../settings');
var handleErrors    = require('../error-handler');
var paths           = require('../paths');

exports.registerTasks = function(gulp) {

    var options = {
        batch : [settings.hbs.handlebarsPartialsPath]
    };

    // Compiles handlebars templates to html
    gulp.task('egb:views:handlebar-templates:build', ['egb:init'], function () {
        return gulp.src(paths.handlebarsViews)
            .pipe(handlebars(settings.variables, options))
            .pipe(rename(function (path) {
                path.extname = '.html';
            }))
            .pipe(size({title: 'handlebars templates', showFiles: false}))
            .pipe(gulp.dest(paths.build.dest))
            .on('error', handleErrors);
    });

    // Compiles angular templates to a single JavaScript module which populates the template-cache
    gulp.task('egb:views:angular-templates:build', ['egb:init'], function () {
        var revAllOpts = _.defaults({dontRenameFile: '.html', base: paths.appRoot}, settings.revall.options);
        var revall = new RevAll(revAllOpts);

        return gulp.src(paths.templates)
            .pipe(revall.revision())
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

    gulp.task('egb:views:watch', ['egb:views:build'], function () {
        return gulp.watch([paths.handlebarsViews, settings.hbs.handlebarsPartialsPath + '/**/*'], ['egb:views:handlebar-templates:build']);
    });

    gulp.task('egb:views:build', ['egb:views:handlebar-templates:build', 'egb:views:angular-templates:build']);
};
