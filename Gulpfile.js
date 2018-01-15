const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

gulp.task('sass', () => {
  return gulp.src('./static/stylesheets/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./static/dist/stylesheets/'));
});

gulp.task('sass:watch', ['sass'], () => {
  gulp.watch('./static/stylesheets/*', ['sass']);
});

gulp.task('webpack', () => {
  return gulp.src('./static/js/main.js')
    .pipe(webpackStream(require('./webpack.config.js'), webpack))
    .pipe(gulp.dest('./static/dist/js/'));
});

gulp.task('webpack:watch', ['webpack'], () => {
  gulp.watch(
    ['./static/js/**/**.js*', './static/stylesheets/*'],
    ['sass', 'webpack']
  );
});

gulp.task('default', ['webpack', 'sass']);

gulp.task('build:watch', ['webpack:watch', 'sass:watch']);
