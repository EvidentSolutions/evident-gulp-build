"use strict";

var parentRequire = require('parent-require');
var gulp            = parentRequire('gulp');
var del             = require('del');
var path            = require('path');
var source          = require('vinyl-source-stream');
var express         = require('express');
var http            = require('http');
var morgan          = require('morgan');
var livereload      = require('gulp-livereload');
var sass            = require('gulp-sass');
var size            = require('gulp-size');

var templateCache   = require('gulp-angular-templatecache');
var rename          = require("gulp-rename");
var handlebars      = require('gulp-compile-handlebars');
var revall          = require('gulp-rev-all');
var gulpif          = require('gulp-if');
var concatCss       = require('gulp-concat-css');
var gutil           = require('gulp-util');
var protractor      = require('gulp-protractor').protractor;
var karma           = require('gulp-karma');

var settings        = require('./settings');
var handleErrors    = require('./error-handler');
var paths           = require('./paths');

require('./browserify-compile');

var config = {
    // Should we start watching for changes?
    watch: true
};

// Starts an express server serving the static resources and begins watching changes
gulp.task('serve:internal', ['watch'], function() {
    var app = express();

    app.use(morgan('dev'));
    app.use(settings.indexPagePattern, express.static(path.join(paths.build.dest, 'index.html')));
    app.use(express.static(paths.build.dest));
    app.use(express.static(settings.paths.templates));

    //noinspection JSUnresolvedFunction
    http.createServer(app).listen(settings.serve.port).on('error', handleErrors);
    gutil.log("Started development server:", gutil.colors.magenta("http://localhost:" + settings.serve.port + "/"));

    var lrServer = livereload();
    gulp.watch([path.join(paths.build.dest, '**'), paths.templates])
        .on('change', function(file) { lrServer.changed(file.path);})
        .on('error', handleErrors);
});

// Compiles Sass stylesheets to CSS
gulp.task('sass', function() {
    var options = { };
    if (settings.staticBundle) {
        options.outputStyle = 'compressed';
    } else {
        options.outputStyle = 'nested';

        if (process.platform !== 'win32') {
            // Source maps are broken on Windows. See https://github.com/dlmanning/gulp-sass/issues/28
            options.sourceComments = 'map';
        }
    }

    return gulp.src(paths.sass)
        .pipe(sass(options))
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest(path.join(paths.build.dest, 'css')))
        .on('error', handleErrors);
});

// Copies the stylesheets of EpicEditor to proper place
gulp.task('epiceditor-css', function() {
    return gulp.src('./bower_components/epiceditor/epiceditor/**/*.css')
        .pipe(gulp.dest(path.join(paths.build.dest, 'css/epiceditor')))
        .on('error', handleErrors);
});

// Creates a bundle from vendor CSS files
gulp.task('vendor-css', ['epiceditor-css'], function() {
    return gulp.src(paths.vendor.stylesheets)
        .pipe(concatCss("vendor-bundle.css"))
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest(path.join(paths.build.dest, 'css')))
        .on('error', handleErrors);
});

// Copies fonts to proper place
gulp.task('fonts', function() {
    return gulp.src(paths.vendor.fonts)
        .pipe(gulp.dest(path.join(paths.build.dest, 'fonts')))
        .on('error', handleErrors);
});

// Builds all styles
gulp.task('styles', ['sass', 'vendor-css', 'fonts']);

// Starts watching for changes
gulp.task('watch', ['compile:watch', 'styles', 'templates'], function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.views, ['compile-views']);
});

// Compiles handlebars templates to html
gulp.task('compile-views', function() {
    return gulp.src(paths.views)
        .pipe(handlebars({ staticBundle: settings.staticBundle }))
        .pipe(rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(paths.build.dest))
        .on('error', handleErrors);
});

// Compiles angular templates to a single JavaScript module which populates the template-cache
gulp.task('compile-angular-templates', function () {
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

// Runs JavaScript unit tests
gulp.task('test', function() {
    return gulp.src("./test/unit/**/*_spec.js")
        .pipe(karma({
            configFile: 'test/karma.conf.js',
            action: 'run'
        }))
        .on('error', handleErrors);
});

// Runs JavaScript end-to-end tests. Requires that the application and webdriver-manager are running.
gulp.task('test-e2e', function() {
    return gulp.src(["./test/e2e/**/*_spec.js"])
        .pipe(protractor({
            configFile: "test/protractor.conf.js"
        }))
        .on('error', handleErrors);
});

// Build all templates
gulp.task('templates', ['compile-views', 'compile-angular-templates']);

// Cleans everything built
gulp.task('clean', function (cb) {
    del(settings.paths.output, cb);
});

// Builds everything
gulp.task('build', ['compile:bundle', 'styles', 'templates']);

// Create an optimized build
gulp.task('build-optimized', ['build'], function() {
    return gulp.src(path.join(paths.build.dest, '**'))
        .pipe(revall({ ignore: [/^index.html$/, /^css\/epiceditor\/.+/] }))
        .pipe(gulp.dest(path.join(settings.paths.output, 'optimized')));
});

// Creates a production build
gulp.task('build-production', ['clean'], function() {
    settings.staticBundle = true;
    config.watch = false;
    gulp.start('build-optimized');
});

// Creates a development build
gulp.task('build-development', ['clean'], function() {
    settings.staticBundle = false;
    config.watch = false;
    gulp.start('build');
});

gulp.task('serve', function(cb) {
    config.exitOnFailure = false;
    gulp.start(['serve:internal']);
    cb();
});

gulp.task('serve:bundle', function (cb) {
    settings.staticBundle = true;

    gulp.start(['compile:bundle', 'compile-views', 'compile-angular-templates', 'serve']);
    cb();
});

// By default, clean everything built and start local server
gulp.task('default', ['clean'], function () {
    gulp.start('serve');
});
