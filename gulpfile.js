var gulp = require('gulp');
var deploy = require('gulp-gh-pages');
var webserver = require('gulp-webserver')
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var _ = require('lodash');

gulp.task('webserver', function() {
  gulp.src('./public')
    .pipe(webserver({
      fallback: 'index.html',
      livereload: false,
      open: false,
      port: 5000
    }));
});

gulp.task('jade', ['sass'], function() {

  var locals = {
    _ : _
  }
 
  gulp.src('./src/templates/index.jade')
    .pipe(jade({
      locals: locals
    }))
    .pipe(gulp.dest('./public/'))
});

gulp.task('sass', function () {
  return gulp.src('./src/stylesheets/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/'));
});

gulp.task('scripts', function() {
  return browserify('./src/js/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/'));
});

gulp.task('compress-images', function () {
  return gulp.src('./src/images/*.png')
    .pipe(tinypng(keys.tinypng))
    .pipe(gulp.dest('./src/images/compressed/'));
});

gulp.task('images', function () {
  return gulp.src('./src/images/compressed/*.{png,jpg}')
    .pipe(gulp.dest('./public/images/'));
});

gulp.task('pdfs', function () {
  return gulp.src('./src/pdfs/*.pdf')
    .pipe(gulp.dest('./public/pdfs/'));
});

gulp.task('git', function () {
  return gulp.src("./public/**/*")
    .pipe(deploy())
});

gulp.task('deploy', function(done){
  runSequence('build', 'git', done);
});

gulp.task('watch', function() {
  gulp.watch('./src/stylesheets/*.scss', ['sass']);
  gulp.watch('./src/templates/*.jade', ['jade']);
  gulp.watch('./src/js/*.js', ['scripts']);
});

gulp.task('build', ['sass', 'scripts', 'jade', 'images', 'pdfs']);

gulp.task('default', ['build', 'watch', 'webserver']);
