var gulp = require('gulp'),
    newer = require('gulp-newer'),
    minifyHTML = require('gulp-minify-html'),
    sass = require('gulp-ruby-sass'),
    csslint = require('gulp-csslint'),
    minifyCSS = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    watch = require('gulp-watch'),
    size = require('gulp-filesize'),
    notify = require("gulp-notify"),
    connect = require('gulp-connect');

var paths = {
    app: 'app',
    dist: 'dist',
    html: 'app/*.html',
    appStyles: 'app/styles/**/*.scss',
    distStyles: 'dist/styles',
    sassMain: 'app/styles/main.scss',
    css:  'dist/styles/**/*.css',
    images: 'app/images/**/*'
    //scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
    //images: 'client/img/**/*'
};

gulp.task('minify-html', function() {
    var opts = {
        comments:true,
        spare:true
    };

    gulp.src(paths.html)
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(paths.dist));
});

//Sass Files
gulp.task('sass', function () {
    return gulp.src(paths.sassMain)
    .pipe(sass().on('error', function(err) {
        console.log(err);
    }))
    .pipe(gulp.dest(paths.distStyles))
    .pipe(size());
});

//CSS Linting and report
gulp.task('css', ['sass'], function() {
  gulp.src([paths.css, '!'+paths.dist+'/styles/vendor/**/*.css'])
    .pipe(csslint('csslintrc.json'))
    .pipe(csslint.reporter());
});


//Minify CSS
gulp.task('minifyCSS', ['css', 'sass'], function () {
    gulp.src('dist/styles/main.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.distStyles))
        .pipe(size());
});

gulp.task('imagemin', function () {
    return gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true
        }).on('error', function(err) {
            console.log(err);
        }))
        .pipe(gulp.dest(paths.dist+'/images'));
});

//Copy Files
gulp.task('copy', ['sass', 'css'], function() {
    //Copy vendor styles
    gulp.src(paths.app+'/styles/vendor/**/*.css')
        .pipe(gulp.dest(paths.dist+'/styles/vendor/'));
    //Copy fonts
    gulp.src(paths.app+'/fonts/*')
        .pipe(gulp.dest(paths.dist+'/fonts/'));
});

gulp.task('connect', function() {
    connect.server({
        root: paths.dist,
        livereload: true
    });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.html, ['minify-html']);
    gulp.watch(paths.appStyles, ['sass', 'css', 'minifyCSS']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
    'minify-html',
    'sass',
    'css',
    'minifyCSS',
    'imagemin',
    'copy',
    'connect',
    'watch'
]);
