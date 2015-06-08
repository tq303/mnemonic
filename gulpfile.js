// gulp global
var gulp = require('gulp');

// plugins
var sass = require('gulp-sass'),
	jslint = require('gulp-jslint');

gulp.task('default', ['scss']);

// Compile SCSS
gulp.task('scss', function () {
    gulp.src('./app/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/css'));
});

gulp.task('jslint', function () {
	gulp.src('./app/js/**/*.js')
		.pipe(jslint({

		}))
		.on('error', function (error) {
            console.error(String(error));
        });
});

gulp.task('watch', function() {
    gulp.watch(['./app/scss/**/*.scss'], ['scss']);
    // gulp.watch(['./app/js/**/*.js'], ['jslint']);
});