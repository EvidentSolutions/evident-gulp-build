"use strict";

// We can't require gulp directly because it must be included by the parent project itself.
// Therefore we go through the parent-module loader chain until we find gulp.
module.exports = require('parent-require')('gulp');
