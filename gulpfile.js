const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const cleanCSS = require("gulp-clean-css");
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const gulpSequence = require('gulp-sequence');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('clean-css', ()=> {
    return gulp.src('./src/css/', {read: false})
        .pipe(clean());
});

gulp.task("scss", ['clean-css'], function() {
    return gulp
        .src("./src/scss/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./src/css/"));
});

gulp.task('autoprefix', ['scss'], function() {
    return gulp.src('./src/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('concat-css', ['autoprefix'], ()=>{
    return gulp.src('./src/css/**/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('minify-css', ['concat-css'], ()=>{
    return gulp.src('./src/css/style.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('copy-css', ['minify-css'], () => {
    return gulp.src('./src/css/style.css')
        .pipe(gulp.dest('./build/css/'))
});

gulp.task("srv", ["copy-css","uglify",'img'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("./src/scss/*.scss", ["scss"]).on("change", browserSync.reload);
    gulp.watch("./src/img/*.*", ["img"]).on("change", browserSync.reload);
    gulp.watch("./src/js/*.*", ["js"]).on("change", browserSync.reload);
    gulp.watch("./index.html").on("change", browserSync.reload);
});

gulp.task("concat", function() {
    return gulp.src('./src/js/*.js')
        .pipe(concat('build.js'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('clean', function () {
    return gulp.src('./build/', {read: false})
        .pipe(clean());
});

gulp.task("uglify", ['concat'], function () {
    return gulp.src("./build/js/build.js")
        .pipe(uglify())
        .pipe(rename('build.min.js'))
        .pipe(gulp.dest("./build/js"));
});

gulp.task('img', function() {
    return gulp.src('./src/imgs/*.*')
        .pipe(imagemin({
                interlaced: true,
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            })
        )
        .pipe(gulp.dest('./build/imgs'));
});

gulp.task('dev', gulpSequence('clean', 'srv'));

gulp.task('build', gulpSequence('clean',["scss", "uglify", 'img']) );

gulp.task("default", ["dev"]);
