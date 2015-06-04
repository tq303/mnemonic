/**
 * Created by oliver.white on 03/06/15.
 */
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass');

gulp.task('default', function () {
    return sass('sass/')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('css'));
});

gulp.task('compile-styles', function () {
    return sass('sass/')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('css'));
});

gulp.task('watch', function () {
    gulp.watch('sass/**/*.scss', ['compile-styles']);
});