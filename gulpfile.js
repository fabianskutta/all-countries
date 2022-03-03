// template: https://github.com/Johannes-Schiel/ud-basic-webdev-setup

// Import important packages
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');

// SASS -> CSS
const sass = require('gulp-sass')(require('sass'));
sass.compiler = require('sass');
const Fiber = require('fibers');
const postcss = require('gulp-postcss');
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// HTML
const htmlmin = require('gulp-htmlmin');

// JavaScript
const buffer = require('vinyl-buffer');
const { createGulpEsbuild } = require('gulp-esbuild')
const gulpEsbuild = createGulpEsbuild({ incremental: false })
const concat = require('gulp-concat');
const rimraf = require('rimraf');

// Define important variables
const src = './src';
const dist = './dist';

// Reload the browser
const reload = (done) => {
    browserSync.reload();
    done();
};

// Serve the dev-server in the browser
const serve = (done) => {
    browserSync.init({
        server: {
            baseDir: `${dist}`
        }
    });
    done();
};

function isProduction() {
    return argv.production ? true : false
}

// Compile SASS to CSS
const css = () => {
    // Find SCSS
    return gulp.src(`${src}/assets/scss/**/*.{sass,scss}`)
        // Init Plumber
        .pipe(plumber())
        // Start sourcemap
        .pipe(gulpif(!isProduction(), sourcemaps.init()))
        // Compile SASS to CSS
        .pipe(sass({
            includePaths: ['./node_modules'],
            fiber: Fiber
        }).on('error', sass.logError))
        // Add suffix
        .pipe(rename({ basename: 'style', suffix: '.min' }))
        // Add Autoprefixer & cssNano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Write sourcemap
        .pipe(gulpif(!isProduction(), sourcemaps.write('')))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dist}/assets/css`));
};

// Compile .html to minified .html
const html = () => {
    // Find HTML
    return gulp.src(`${src}/*.html`)
        // Init Plumber
        .pipe(plumber())
        // Compile HTML to minified HTML
        .pipe(htmlmin({
            collapseWhitespace: isProduction(),
            removeComments: true,
            html5: true,
            removeEmptyAttributes: true,
            sortAttributes: true,
            sortClassName: true
        }))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dist}`));
};

// summarize scripts
const script_temp = () => {
    return gulp.src(`${src}/assets/js/**/*`)
        .pipe(concat('script_temp.js'))
        .pipe(gulp.dest(`${dist}/assets/js`));
};

// Compile .js to minified .js
const script_esbuild = () => {
    return gulp.src(`${dist}/assets/js/script_temp.js`)
    .pipe(gulpEsbuild({
        outfile: 'script.min.js',
        minify: true,
        sourcemap: !isProduction(),
        platform: 'browser'
    }))
    .pipe(buffer())
    // Write everything to destination folder
    .pipe(gulp.dest(`${dist}/assets/js`));
};

// delete temp js file
const script_clean = (done) => {
    rimraf(`${dist}/assets/js/script_temp.js`, done);
};

const script = gulp.series(script_temp, script_esbuild, script_clean)

// Copy assets
const assets = () => {
    return gulp.src(`${src}/assets/img/**`)
        .pipe(gulp.dest(`${dist}/assets/img`));
};

// Watch changes and refresh page
const watch = () => gulp.watch(
    [
        `${src}/*.html`,
        `${src}/assets/**/*.*`
    ],
    gulp.series(
        assets,
        css,
        script,
        html,
        reload
    ));

// Development tasks
const dev = gulp.task('dev', gulp.series(gulp.parallel(assets, css, script, html), serve, watch));

// Build tasks
const build = gulp.task('build',
    gulp.parallel(
        assets,
        html,
        css,
        script
    ));

// Default function (used when type "gulp")
exports.default = dev;
exports.dev = dev;
exports.build = build;