evident-gulp-build
==================

Common builds for Angular apps using Browserify, Sass, TypeScript, etc.

Getting started
---------------

To get started, execute `npm install --save-dev gulp evident-gulp-build` and create `gulpfile.js`
with the following configuration:

    var gulp = require('gulp');
    var evidentGulpBuild = require('evident-gulp-build');

    evidentGulpBuild.registerDefaultTasks(gulp);

This will define a bunch of default tasks using default configuration. You can configure the tasks
to some extend, override them or add your own tasks if you will.

Project structure
-----------------

The input project is assumed to have the following directory structure:

  - `app` contains JavaScript/TypeScript-code, Angular HTML-templates, styles, images, etc.
     Almost everything goes here. How you structure the application inside this directory is
     up to you, but the main entry point is assumed to be `app/main.js`  or `app/main.ts`.
  - `views` contains Handlebar-templates that are converted to HTML during build time. These
     are not Angular templates, but typically things like the initial entry point of your
     application. If you are generating views dynamically with JSP or such, you might not
     have this directory at all.
  - `test/unit` contains unit tests that are executed using [Karma](http://karma-runner.github.io/).
  - `test/e2e` contains end-to-end tests that are executed using [Protractor](http://angular.github.io/protractor/).

Then there are some directories for external libraries and such:

  - `node_modules` contains libraries downloaded by [npm](https://www.npmjs.com/).
  - `bower_components` contains libraries downloaded by [Bower](http://bower.io/).
  - `typings` contains TypeScript definition files downloaded by [tsd](https://github.com/DefinitelyTyped/tsd).

Finally, there are the output directories:

  - `build/egb/optimized` contains the final build with all optimizations performed.
  - `build/egb/static` contains a static build you can serve when developing.
  - `build/egb/tmp` contains temporary files created during build.

Interesting tasks
-----------------

  - `watch` compiles everything into `build/egb/static` and starts watching for changes in the background.
  - `build` creates an optimized build into `build/egb/optimized`.

Settings
--------

The settings are exposed in a `settings` property of the module, so you can write something like
the following:

    evidentGulpBuild.settings.traceur.enabled = false;
    evidentGulpBuild.settings.typescript.flags.noImplicitAny = false;

See [lib/settings.js](lib/settings.js) for details.

Variables
---------

The object `evidentGulpBuild.settings.variables` is exposed both to [envify](https://github.com/hughsk/envify)-transform
and to Handlebars-templates which allows you to have some build-variables. You could, for example have:

    gulp.task('build-production', function () {
        Object.assign(settings.variables, {
            GA_ID: '12345678-9',
            USE_TEMPLATE_CACHE: true,
            DEBUG_LOGGING: false
        });
        return gulp.start('build');
    });

Moreover, there is a predefined variable `EGC_SCM_VERSION` that contains git-version from which the build was made.
