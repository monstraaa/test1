const {src,dest,series,watch} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const sourceMaps = require('gulp-sourcemaps')
const del = require('del');
const browserSync = require("browser-sync").create();
const image = require('gulp-image');

//task for styles
const styles = () => {
    return src('src/style/**/*.css')
        .pipe(sourceMaps.init())
        .pipe(concat('style.css'))
        .pipe(autoprefixer('last 5 versions'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourceMaps.write())
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
} 

//task for html
const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'));
}

const svgSprites =() => {
    return src('src/images/svg/**/*.svg')
    .pipe(svgSprite({
        mode:{
            stack:{
                sprite: '../sprite.svg'
            }
        }
    }))
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream());
}

const images = () =>{
    return src([
        'src/images/**/*.jpg',
        'src/images/**/*.jpeg',
        'src/images/**/*.png',
        'src/images/*.svg'
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream())
}

const scripts = () =>{
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
    .pipe(sourceMaps.init())
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify({
        toplevel:true
    }).on('error',notify.onError()))
    .pipe(sourceMaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const resources = () => {
    return src('src/resources/**')
        .pipe(dest('dist'))
}

const clean = () => {
    return del('dist')
}

const watchFile = () => {
    browserSync.init({
        server:{
            baseDir:'dist'
        }
    })
}

watch('src/**/*.html',htmlMinify);
watch('src/style/**/*.css',styles);
watch('src/images/svg/**/*.svg',svgSprites);
watch([
    'src/images/**/*.jpg',
        'src/images/**/*.jpeg',
        'src/images/**/*.png',
        'src/images/*.svg'
],images);
watch('stc/js/**/*.js',scripts);
watch('src/resources/**',resources);


// exporting tasks
//exports.styles = styles;
//exports.html = htmlMinify;
exports.clean = clean;
exports.default = series(clean,styles,htmlMinify,svgSprites,images,scripts,resources,watchFile);
