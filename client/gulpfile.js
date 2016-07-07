/**
 *  The gulp tasks are split into several files in the /gulp directory because putting it all here would be way too much.
 */

'use strict';

var gulp = require('gulp');
var wrench = require('wrench');

/**
 *  This will load all .js or .coffee files in the gulp directory in order to load all gulp tasks contained in those files.
 */
wrench.readdirSyncRecursive('./gulp').filter(function (file) {
    return (/\.(js|coffee)$/i).test(file);
}).map(function (file) {
    require('./gulp/' + file);
});

/**
 *  Teh default task cleans temporary directories and launches the main optimization build task.
 */
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
