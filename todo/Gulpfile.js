var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');


var bundler = watchify(browserify('./js/app.coffee', { cache: {}, packageCache: {}, fullPaths: true, debug: true }));

gulp.task('watch', bundle);
bundler.on('update', bundle);

function bundle() {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(streamify(uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./js'));
}
