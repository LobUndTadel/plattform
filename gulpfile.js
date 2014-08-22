var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var uglify = require('uglifyify');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var fs = require('fs');
var pathJoin = require('path').join;

gulp.task('less', function() {
  return gulp.src('app/public/assets/css/index.less')
  //  .pipe(rev())
    .pipe(less({
    	paths: [ pathJoin(__dirname, 'node_modules') ]
    }))
    .pipe(gulp.dest('app/public/build'))
    .pipe(rename('bundle.css'))
   // .pipe(rev.manifest())
    .pipe(gulp.dest('app/public/build'))
});


/*gulp.task('scripts', function() {
	var file = 'app/public/assets/js/index.js';
	var bundler = browserify();

	bundler.add('./app/public/assets/js/index.js')
	bundler.transform(reactify);
	/*bundler.transform({
  		global: true
	}, 'uglifyify');


	return bundler.bundle()
		.on('error', handleErrors)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('app/public/build/'));
});*/

gulp.task('scripts', function() {
    var bundler = browserify({
        entries: ['./app/public/assets/js/index.js'], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
    });
   
    bundler
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./app/public/build/'));
});


gulp.task('watch', ['less', 'scripts'], function() {
  gulp.watch('app/public/assets/css/*.less', ['less']);
  gulp.watch('app/public/assets/js/*', ['scripts']);
});