"use strict";

var del             = require('del');
var path            = require('path');
var browserify      = require('browserify');
var browserifyShim  = require('browserify-shim');
var es6ify          = require('es6ify');
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
var envifyCustom    = require('envify/custom');
var revall          = require('gulp-rev-all');
var uglify          = require('gulp-uglify');
var gulpif          = require('gulp-if');
var streamify       = require('gulp-streamify');
var concatCss       = require('gulp-concat-css');
var gutil           = require('gulp-util');
var protractor      = require('gulp-protractor').protractor;
var karma           = require('gulp-karma');
var watchify        = require('watchify');

var settings = require('./lib/settings');
var handleErrors = require('./lib/error-handler');

function register(gulp) {

    var config = {
        // Should we start watching for changes?
        watch: true
    };

    // Paths for various assets.
    var paths = {
        sass: './src/css/*.scss',
        templates: path.join(settings.paths.templates, '**/*.html'),
        views: './src/views/**/*.hbs',
        build: {
            dest: path.join(settings.paths.output, 'static'),
            tmp: path.join(settings.paths.output, 'tmp')
        },
        vendor: {
            stylesheets: [
                './bower_components/bootstrap/dist/css/bootstrap.min.css',
                './bower_components/font-awesome/css/font-awesome.min.css',
                './bower_components/animate.css/animate.min.css'
            ],
            fonts: [
                './bower_components/bootstrap/dist/fonts/*',
                './bower_components/font-awesome/fonts/*'
            ]
        }
    };

    // Read 'package.json' to see which external libraries we are using and mark them
    // as external libraries for browserify. This lets us produce different bundles for
    // external libraries and our own code, making the incremental builds faster.
    var externalLibraries = [];
    var browserDependencies = require('./package.json').browser;
    for (var key in browserDependencies) {
        if (browserDependencies.hasOwnProperty(key) && /^\.\/(node_modules|bower_components)\/.+$/.test(browserDependencies[key]))
            externalLibraries.push(key);
    }

    // Create a bundle containing all external libraries. Note that this is only needed when debugging,
    // because in static bundle the external libraries are bundled in the main JS.
    gulp.task('compile-libs', function () {

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

        /* @type {Object} */
        var bundler = browserify('./src/js/main.js', {debug: settings.staticBundle, cache: {}, packageCache: {}, fullPaths: true});
        if (watch) {
            bundler = watchify(bundler);

            // when watching, we don't wish to rebuild the external libraries all the time, so
            // we'll exclude them from the bundle
            bundler.external(externalLibraries);

            // During watching we wish to load the templates directly from the server.
            bundler.ignore('templates');

            bundler.on('update', rebundle);
        }

        // bundler.plugin('tsify', { noImplicitAny: false, target: 'ES5' });
        bundler.transform(browserifyShim);
        bundler.transform(es6ify.configure(/^(?!.*(node_modules|bower_components))+.+\.js$/));
        bundler.transform(envifyCustom(env));

        bundler.on('log', function (msg) {
            msg = msg.replace(/\d+(\.\d*)? seconds*/g, function (m) { return gutil.colors.magenta(m); });
            gutil.log("watchify:", gutil.colors.blue('app.js'), msg);
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
    gulp.task('compile-js', ['compile-libs', 'compile-angular-templates'], function () {
        return compileAppJs('app.js', true);
    });

    // Starts an express server serving the static resources and begins watching changes
    gulp.task('serve', ['watch'], function() {
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
    gulp.task('watch', ['build'], function() {
        //gulp.watch(['./src/js/**/*.js'], ['compile-js']);
        gulp.watch(paths.sass, ['sass']);
        gulp.watch(paths.views, ['compile-views']);
    });

    // Compiles handlebars templates to html
    gulp.task('compile-views', function() {
        return gulp.src(paths.views)
            .pipe(handlebars({}))
            .pipe(rename(function(path) {
                path.extname = '.html';
            }))
            .pipe(gulp.dest(paths.build.dest))
            .on('error', handleErrors);
    });

    // Compiles angular templates to a single JavaScript module which populates the template-cache
    gulp.task('compile-angular-templates', function () {
        return gulp.src(paths.templates)
            .pipe(templateCache({
                'module': 'blogular.templates',
                'standalone': true,
                'root': '/templates/'
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
    gulp.task('build', ['compile-js', 'styles', 'templates']);

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

    // By default, clean everything built and start local server
    gulp.task('default', ['clean'], function () {
        gulp.start('serve');
    });
}

exports.settings = settings;
exports.register = register;
