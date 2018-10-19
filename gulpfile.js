/**
 * Created by j on 14.08.15.
 * Modifed by nfo on 15.10.16
 *
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    babel = require("gulp-babel"),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    del = require('del'),
    gzip   = require('gulp-gzip');




gulp.task('react', function() {
    return gulp.src(
        [
            'public/js/jsx/Author.jsx',
            'public/js/jsx/Comments.jsx',
            'public/js/jsx/Stream.jsx',
            'public/js/jsx/Likes.jsx',
            'public/js/jsx/SearchBox.jsx',
            'public/js/jsx/Chat.jsx',
            'public/js/jsx/ShareBox.jsx',
            'public/js/jsx/Notifications.jsx',
            'public/js/jsx/InitStream.jsx'

        ]
    )
    .pipe(babel({"presets": ["@babel/preset-react"]}))
    .pipe(concat('react.js'))
    .pipe(gulp.dest('public/js/'))
});
gulp.task('freact', function() {
    return gulp.src(
        [
            'public/js/jsx/Author.jsx',
            'public/js/jsx/Stream.jsx',
            'public/js/jsx/Likes.jsx',
            'public/js/jsx/SearchBox.jsx',
            'public/js/jsx/Chat.jsx',
            'public/js/jsx/ShareBox.jsx',
            'public/js/jsx/Notifications.jsx',
            'public/js/jsx/InitStream.jsx'
        ]
    )
    .pipe(babel({"presets": ["@babel/preset-react"]}))
    .pipe(concat('react.js'))
    .pipe(gulp.dest('public/js/'))
});

gulp.task('compress-js', function(){
    return gulp.src(
        [
            "node_modules/highlight.js/lib/highlight.js",
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/jquery-textcomplete/dist/jquery.textcomplete.min.js",
            "node_modules/bootstrap/dist/js/bootstrap.min.js",
            "node_modules/react/umd/react.development.js",
            "node_modules/react-dom/umd/react-dom.development.js",
            "public/js/main.js",
            "public/js/react.js"
        ]
    )
     .pipe(uglify())
     .pipe(concat('app.js'))
     .pipe(gulp.dest('public/js/'))
          

});

gulp.task('sass', function () {
  return gulp.src('public/css/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('compress-css', function(){

    return gulp.src(['node_modules/font-awesome/css/font-awesome.css',  
                     'node_modules/bootstrap/dist/css//bootstrap.min.css', 
                     'node_modules/highlight.js/styles/qtcreator_dark.css',
                     'public/css/dmdn.css'])
    .pipe(concat('style.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('public/css'));


});


gulp.task('icons', function() { 
    return gulp.src(['bower_components/fontawesome/fonts/**.*', 'bower_components/bootstrap-css/fonts/*.*']) 
        .pipe(gulp.dest('public/fonts')); 
});



gulp.task('default', function() {
    gulp.start('react', 'sass', 'compress-css', 'compress-js', 'icons');
});


gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('public/css/scss/*.scss', ['sass']);

    // Watch .jsx files
    gulp.watch('public/jsx/*.jsx', ['react']);
});



gulp.task('watch', function() {
    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
});
