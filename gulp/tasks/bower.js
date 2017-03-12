import gulp from 'gulp';
import config      from '../config';

gulp.task('bower', function () {
  return gulp.src(config.bower.src)
    .pipe(gulp.dest(config.bower.dest));
});
