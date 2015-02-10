"use strict";

var parentRequire = require('parent-require');
var gulp            = parentRequire('gulp');
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

var handleErrors    = require('./error-handler');
var settings        = require('./settings');
var paths           = require('./paths');

var packageJson = JSON.parse(fs.readFileSync('./package.json'));

// Read 'package.json' to see which external libraries we are using and mark them
// as external libraries for browserify. This lets us produce different bundles for
// external libraries and our own code, making the incremental builds faster.
var externalLibraries = [];
var browserDependencies = packageJson.browser;

for (var key in browserDependencies) {
    if (browserDependencies.hasOwnProperty(key) && /^\.\/(node_modules|bower_components)\/.+$/.test(browserDependencies[key]))
        externalLibraries.push(key);
}

// Create a bundle containing all external libraries. Note that this is only needed when debugging,
// because in static bundle the external libraries are bundled in the main JS.
gulp.task('browserify:compile-libs', function () {

    /* @type {Object} */
    var bundler = browserify({debug: true});
    bundler.transform(browserifyShim);
    bundler.on('error', handleErrors);

    for (var key in browserDependencies)
        if (browserDependencies.hasOwnProperty(key) && /^\.\/(node_modules|bower_components)\/.+$/.test(browserDependencies[key]))
            bundler.require(browserDependencies[key], {expose: key});

    return bundler.bundle()
        .on('error', handleErrors)
        .pipe(source('libs.js'))
        .pipe(gulp.dest(path.join(paths.build.dest, 'js')));
});

function compileAppJs(targetName, watch) {
    // Variables which will be inlined to src/js/config.js
    var env = {
        API_BASE: settings.staticBundle ? '/api' : 'http://localhost:8080/api',
        USE_TEMPLATE_CACHE: settings.staticBundle,
        DEBUG_LOGGING: !settings.staticBundle
    };

    var bundler = browserify(settings.paths.entryPoint, {debug: settings.staticBundle, cache: {}, packageCache: {}, fullPaths: true});
    if (watch) {
        bundler = watchify(bundler);

        // when watching, we don't wish to rebuild the external libraries all the time, so
        // we'll exclude them from the bundle
        bundler.external(externalLibraries);

        // During watching we wish to load the templates directly from the server.
        bundler.ignore('angular-templates');

        bundler.on('update', rebundle);
    } else {
        bundler.require('./' + path.join(settings.paths.output, 'tmp/angular-templates.js'), { expose: 'angular-templates' });
    }

    bundler.require(require.resolve('es6ify/node_modules/traceur/bin/traceur-runtime.js'), { expose: 'traceur-runtime' });

    // bundler.plugin('tsify', { noImplicitAny: false, target: 'ES5' });
    bundler.transform(browserifyShim);
    bundler.transform(es6ify.configure(/^(?!.*(node_modules|bower_components))+.+\.js$/));
    bundler.transform(envifyCustom(env));

    bundler.on('log', function (msg) {
        msg = msg.replace(/\d+(\.\d*)? seconds*/g, function (m) { return gutil.colors.magenta(m); });
        gutil.log("browserify:", gutil.colors.blue(targetName), msg);
    });

    bundler.on('error', handleErrors);

    function rebundle() {
        return bundler.bundle()
            .on('error', handleErrors)
            .pipe(source(targetName))
            .pipe(gulpif(settings.staticBundle, streamify(uglify())))
            .pipe(gulp.dest(path.join(paths.build.dest, 'js')));
    }

    return rebundle();
}

// Create a bundle containing our own dependencies.
gulp.task('browserify:watch', ['browserify:compile-libs'], function () {
    return compileAppJs('app.js', true);
});

gulp.task('browserify:bundle', ['angular-templates:build'], function () {
    return compileAppJs('bundle.js', false);
});
