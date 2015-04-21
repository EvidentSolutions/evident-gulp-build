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

    var packageJson = JSON.parse(fs.readFileSync('./package.json'));
    var browserDependencies = packageJson.browser || {};

    function resolveExternalLibraries() {
        var externalLibraries = [];

        // Add all our dependencies
        Object.keys(packageJson.dependencies).forEach(function (dep) {
            if (!_.includes(settings.browserify.ignoredExternalLibraries, dep)) {
                externalLibraries.push(dep);
            }
        });

        // Add all browser-dependencies
        Object.keys(browserDependencies).forEach(function (dep) {
            if (/^\.\/bower_components\/.+$/.test(browserDependencies[dep]) && !_.includes(settings.browserify.ignoredExternalLibraries, dep)) {
                externalLibraries.push(dep);
            }
        });

        return externalLibraries;
    }

    function detectEntryPoint() {
        var result = _.find(paths.entryPointCandidates, fs.existsSync);
        if (!result)
            throw new Error("could not find entry-point, tried " + paths.entryPointCandidates.join(', '));

        return fixPath(result);
    }

    // browserify needs to have relative paths starting with './'
    function fixPath(p) {
        if (p.startsWith('.') || p.startsWith('/'))
            return p;
        else
            return './' + p;
    }

    function compileAppJs(targetName, watch, debug) {
        var entryPoint = detectEntryPoint();

        var bundler = browserify(entryPoint, {
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
            bundler.require(fixPath(path.join(paths.build.tmp, 'angular-templates.js')), {expose: 'angular-templates'});
        }

        bundler.external(resolveExternalLibraries());

        if (settings.traceur.enabled) {
            bundler.transform(es6ify.configure(/^(?!.*(node_modules|bower_components))+.+\.js$/));

            // TODO: figure out a way to bundle the runtime automatically without needing require('traceur-runtime') in code
            bundler.require(require.resolve('es6ify/node_modules/traceur/bin/traceur-runtime.js'), {expose: 'traceur-runtime'});
        }

        if (settings.typescript.enabled) {
            bundler.plugin('evident-gulp-build/node_modules/tsify', settings.typescript.flags);
        }

        if (packageJson['browserify-shim']) {
            bundler.transform(browserifyShim);
        }
        bundler.transform(envifyCustom(settings.variables));

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

    function compileVendorJs(targetName, debug) {
        var bundler = browserify({debug: debug});

        if (packageJson['browserify-shim']) {
            bundler.transform(browserifyShim);
        }

        bundler.on('error', handleErrors);

        resolveExternalLibraries().forEach(function (library) {
            var module = browserDependencies[library] || library;
            bundler.require(module, {expose: library});
        });

        return bundler.bundle()
            .on('error', handleErrors)
            .pipe(source(targetName))
            .pipe(gulpif(!debug, streamify(uglify())))
            .pipe(gulp.dest(path.join(paths.build.dest, 'js')));
    }

    gulp.task('egb:js:vendor:build', ['egb:init'], function () {
        return compileVendorJs('vendor.js', settings.debug);
    });

    gulp.task('egb:js:app:build', ['egb:init', 'egb:views:angular-templates:build'], function () {
        return compileAppJs('app.js', false, settings.debug);
    });

    gulp.task('egb:js:build', ['egb:js:vendor:build', 'egb:js:app:build']);

    gulp.task('egb:js:watch', ['egb:js:vendor:build'], function () {
        return compileAppJs('app.js', true, settings.debug);
    });
};
