"use strict";

var path = require('path');
var settings = require('./settings');

// Paths for various assets.
module.exports = {
    get sassRoots() { return [path.join(settings.paths.appRoot, '**/*.scss'), path.join(settings.paths.appRoot, '**/*.sass')]; },
    get templates() { return path.join(settings.paths.appRoot, '**/*.html'); },
    get handlebarsViews() { return path.join(settings.paths.viewRoot, '**/*.hbs'); },
    build: {
        get dest() { return path.join(settings.paths.output, 'static'); },
        get tmp() { return path.join(settings.paths.output, 'tmp'); }
    }
};
