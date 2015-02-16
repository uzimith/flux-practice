var gulp = require('gulp')
var watchify = require('watchify');
var browserify = require('browserify');
var gutil = require('gulp-util');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

watchify.args.debug = true

var target = './index.coffee'

var bundler = watchify(browserify(target, watchify.args));

function bundle() {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.'));
}

bundler.on('update', bundle);
bundler.on('log', gutil.log.bind(gutil, 'log'))

gulp.task('watch', bundle);

gulp.task('build', function() {
  browserify(target, watchify.args).bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('.'));
})
