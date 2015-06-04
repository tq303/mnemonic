// gulp global
var gulp = require('gulp');

// plugins
var sass = require('gulp-sass');

gulp.task('default', ['scss']);

// Compile SCSS
gulp.task('scss', function () {
    gulp.src('./app/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/css'));
});