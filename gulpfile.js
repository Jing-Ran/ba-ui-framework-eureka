var gulp = require('gulp');
var minimist = require('minimist');
var htmlhint = require('gulp-htmlhint');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-clean-css');
var concat = require('gulp-concat');
// var rename = require('gulp-rename');
// var uglifyJs = require('gulp-uglify');

var knownOptions = {
  string: 'path',
  default: {
    path: './'
  }
};
var options = minimist(process.argv.slice(2), knownOptions);


function handleError(error) {
  console.log(error.toString());
  process.exit(1);
}

// Validate HTML
gulp.task('html', function () {
  console.log(options.path);
  return gulp.src('./*.html')
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter());
});

// compile sass task
gulp.task('sass', function () {
  return gulp.src('styles/sass/eureka.scss')
    .pipe(sass()).on('error', handleError)
    .pipe(gulp.dest('styles/css'));
});

// watch sass changes
gulp.task('watch', function () {
  gulp.watch('styles/sass/*.scss', ['sass']);
});

// Validate CSS
gulp.task('csslint', function () {
  return gulp.src('styles/css/*.css')
    .pipe(csslint('csslintrc.json'))
    .pipe(csslint.formatter('compact'))
    .pipe(csslint.formatter('fail'));
});

// Validate js
gulp.task('lint', function () {
  return gulp.src(options.path)
    .pipe(jshint({
      undef: true,
      globals: {
        module: true,
        require: true,
        console: true
      }
    }))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail')); // Stops running if any error exists
});

// Minify images
gulp.task('optimize-img', function () {
  return gulp.src('images/**/**/')
    .pipe(imagemin()).on('error', handleError)
    .pipe(gulp.dest('min/img'));
});

// Concatenate and minify compiled css files
gulp.task('optimize-css', function () {
  return gulp.src('styles/css/*.css')
    .pipe(minifyCss()).on('error', handleError)
    .pipe(gulp.dest('min'));
});