"use strict";

exports.registerTasks = function (gulp) {

    gulp.task('resources:build');

    gulp.task('resources:watch', ['resources:build']);
};
