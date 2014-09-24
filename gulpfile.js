var del					= require('del'),
		gulp				= require('gulp'),
		less				= require('gulp-less'),
		cssmin			= require('gulp-cssmin'),
		rename			= require('gulp-rename'),
		replace			= require('gulp-replace'),
		sourcemaps	= require('gulp-sourcemaps'),
		prefix			= require('gulp-autoprefixer'),
		pkg					= require('./package.json');

function compileCSS(fileName, doSourcemaps, doMinify) {
	return function () {
		var stream = gulp.src(['less/gridiron.less']);

		if (doSourcemaps) {
			stream = stream.pipe(sourcemaps.init());
		}

		stream = stream
			.pipe(less())
			.pipe(prefix('last 2 versions', 'ie 9'))
			.pipe(replace(/@DATE/, (new Date).toISOString().replace(/:\d+\.\d+/, '')))
			.pipe(replace(/@VERSION/, pkg.version));

		if (doMinify) {
			stream = stream.pipe(cssmin({
				compress: true
			}));
		}

		if (doSourcemaps) {
			stream = stream.pipe(sourcemaps.write());
		}

		return stream
			.pipe(rename(fileName))
			.pipe(gulp.dest('dist'));
	};
}

gulp.task('clean', function (cb) {
	del(['dist'], cb);
});

gulp.task('build:compile', compileCSS('gridiron.css', false, false));
gulp.task('build:minify', compileCSS('gridiron.min.css', false, true));
gulp.task('build:compileWithSourcemaps', compileCSS('gridiron.sm.css', true, false));
gulp.task('build:minifyWithSourcemaps', compileCSS('gridiron.sm.min.css', true, true));

gulp.task('build', ['clean', 'build:compile', 'build:minify', 'build:compileWithSourcemaps', 'build:minifyWithSourcemaps']);
