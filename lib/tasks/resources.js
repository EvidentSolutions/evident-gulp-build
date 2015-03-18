"use strict";

exports.registerTasks = function (gulp) {

    gulp.task('egb:resources:build');

    gulp.task('egb:resources:watch', ['egb:resources:build']);
};
