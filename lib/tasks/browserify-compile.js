"use strict";

var envifyCustom    = require('envify/custom');
var path            = require('path');
var browserify      = require('browserify');
var browserifyShim  = require('browserify-shim');
var es6ify          = require('es6ify');
var watchify        = require('watchify');
var fs              = require('fs');
var source          = require('vinyl-source-stream');
var gutil           = require('gulp-util');
var uglify          = require('gulp-uglify');
var streamify       = require('gulp-streamify');
var gulpif          = require('gulp-if');
var _               = require('lodash');

var handleErrors    = require('../error-handler');
var settings        = require('../settings');
var paths           = require('../paths');

exports.registerTasks = function(gulp) {

    // Read 'package.json' to see which external libraries we are using and mark them
    // as external libraries for browserify. This lets us produce different bundles for
    // external libraries and our own code, making the incremental builds faster.
    var packageJson = JSON.parse(fs.readFileSync('./package.json'));
    var browserDependencies = packageJson.browser;
    var externalLibraries = Object.keys(browserDependencies).filter(function (key) {
        return /^\.\/(node_modules|bower_components)\/.+$/.test(browserDependencies[key]);
    });

    function compileAppJs(targetName, watch, includeExternalLibraries, debug) {
        var env = _.defaults({}, settings.variables);

        var bundler = browserify(settings.paths.entryPoint, {
            debug: debug,
            cache: {},
            packageCache: {},
            fullPaths: true
        });
        if (watch) {
            bundler = watchify(bundler);
            bundler.on('update', rebundle);

            // During watching we wish to load the templates directly from the server.
            bundler.ignore('angular-templates');
        } else {
            bundler.require('./' + path.join(settings.paths.output, 'tmp/angular-templates.js'), {expose: 'angular-templates'});
        }

        if (!includeExternalLibraries)
            bundler.external(externalLibraries);

        if (settings.traceur.enabled) {
            bundler.transform(es6ify.configure(/^(?!.*(node_modules|bower_components))+.+\.js$/));

            // TODO: figure out a way to bundle the runtime automatically without needing require('traceur-runtime') in code
            bundler.require(require.resolve('es6ify/node_modules/traceur/bin/traceur-runtime.js'), {expose: 'traceur-runtime'});
        }

        if (settings.typescript.enabled) {
            bundler.plugin('evident-gulp-build/node_modules/tsify', settings.typescript.flags);
        }

        bundler.transform(browserifyShim);
        bundler.transform(envifyCustom(env));

        bundler.on('log', function (msg) {
            msg = msg.replace(/\d+(\.\d*)? seconds*/g, function (m) {
                return gutil.colors.magenta(m);
            });
            gutil.log("browserify:", gutil.colors.blue(targetName), msg);
        });

        bundler.on('error', handleErrors);

        function rebundle() {
            return bundler.bundle()
                .on('error', handleErrors)
                .pipe(source(targetName))
                .pipe(gulpif(!debug, streamify(uglify())))
                .pipe(gulp.dest(path.join(paths.build.dest, 'js')));
        }

        return rebundle();
    }

    function compileLibs(debug) {
        var bundler = browserify({debug: debug});
        bundler.transform(browserifyShim);
        bundler.on('error', handleErrors);

        externalLibraries.forEach(function (library) {
            bundler.require(browserDependencies[library], {expose: library});
        });

        return bundler.bundle()
            .on('error', handleErrors)
            .pipe(source('libs.js'))
            .pipe(gulpif(!debug, streamify(uglify())))
            .pipe(gulp.dest(path.join(paths.build.dest, 'js')));
    }

    gulp.task('browserify:compile-libs', ['init'], function () {
        return compileLibs(settings.debug);
    });

    // Create a bundle containing our own dependencies.
    gulp.task('browserify:watch', ['browserify:compile-libs'], function () {
        return compileAppJs('app.js', true, false, settings.debug);
    });

    gulp.task('browserify:compile-app', ['init', 'browserify:compile-libs', 'angular-templates:build'], function () {
        return compileAppJs('app.js', false, false, settings.debug);
    });

    gulp.task('browserify:bundle', ['init', 'angular-templates:build'], function () {
        return compileAppJs('bundle.js', false, true, settings.debug);
    });

    gulp.task('browserify:build', ['browserify:bundle']);

};
