var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var uglify = require('uglifyify');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var fs = require('fs');
var pathJoin = require('path').join;

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end');
}

gulp.task('less', function() {
  return gulp.src('app/public/assets/css/index.less')
    .pipe(less({
    	paths: [ pathJoin(__dirname, 'node_modules') ]
    }))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('app/public/build'));
});


gulp.task('scripts', function() {
	var file = 'app/public/assets/js/index.js';
	var bundler = browserify();

	bundler.add('./app/public/assets/js/index.js')
	bundler.transform(reactify);
	/*bundler.transform({
  		global: true
	}, 'uglifyify');*/


	return bundler.bundle()
		.on('error', handleErrors)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('app/public/build/'));
});

gulp.task('watch', ['less', 'scripts'], function() {
  gulp.watch('app/public/assets/css/*.less', ['less']);
  gulp.watch('app/public/assets/js/*', ['scripts']);
});