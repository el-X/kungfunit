/**
 *  This file contains the variables used in other gulp files.
 *  By design, only very generic config values are put here which are used in several places to keep good readability
 *  of said tasks.
 */

var gutil = require('gulp-util');

/**
 *  The main paths of the project.
 */
exports.paths = {
    src: 'src',
    dist: 'dist',
    tmp: '.tmp',
    e2e: 'e2e'
};

/**
 *  Wiredep is the lib which injects bower dependencies in the project.
 *  It is mainly used to inject script tags in the index.html but is also used to inject css preprocessor dependencies
 *  and js files in karma.
 */
exports.wiredep = {
    directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin.
 */
exports.errorHandler = function (title) {
    'use strict';

    return function (err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};
