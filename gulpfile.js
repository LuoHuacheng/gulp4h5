/*
 * @Author: Ryan
 * @Date: 2019-05-06 14:50:28
 * @Last Modified by: Ryan
 * @Last Modified time: 2020-03-11 18:38:33
 */
'use strict';

/* = Gulp
-------------------------------------------------------------- */
// include package
const fs = require('fs');
const path = require('path');

const { series, parallel, src, dest, watch } = require('gulp');

const less = require('gulp-less');
const postcss = require('gulp-postcss');
const pxtoviewport = require('postcss-px-to-viewport');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64');
const cssnano = require('gulp-cssnano');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const concat = require('gulp-concat');
const inject = require('gulp-inject');

const connect = require('gulp-connect');
const proxy = require('http-proxy-middleware');
const changed = require('gulp-changed');
const rename = require('gulp-rename');
const del = require('del');
const through2 = require('through2');

// include config
const config = require('./gulp.config');
const isDev = config.env === 'development';

/* = Task List
-------------------------------------------------------------- */
// html
function html() {
  return src(config.pathSrc.html + '/**/*.html')
    .pipe(isDev ? changed(config.pathDist.html) : through2.obj())
    .pipe(dest(config.pathDist.html))
    .pipe(connect.reload());
}
exports.html = html;

// styles
function styles() {
  return src(config.pathSrc.css + '/*.less')
    .pipe(less())
    .pipe(postcss([autoprefixer(config.autoprefixerConfig)]))
    .pipe(postcss([pxtoviewport(config.pxtoviewportConfig)]))
    .pipe(!isDev ? base64(config.base64Config) : through2.obj())
    .pipe(!isDev ? cssnano() : through2.obj())
    .pipe(dest(config.pathDist.css))
    .pipe(connect.reload());
}
exports.styles = styles;

// images
function images() {
  return src(config.pathSrc.image + '/**/*')
    .pipe(!isDev ? changed(config.pathDist.image) : through2.obj())
    .pipe(
      !isDev
        ? imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
              plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
            }),
          ])
        : through2.obj()
    )
    .pipe(dest(config.pathDist.image))
    .pipe(connect.reload());
}
exports.images = images;

// scripts
function scripts() {
  return src(config.pathSrc.script + '/*.js')
    .pipe(changed(config.pathDist.script))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(!isDev ? uglify() : through2.obj())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(dest(config.pathDist.script))
    .pipe(connect.reload());
}
exports.scripts = scripts;

// copy css
function copycss() {
  return src(config.injectStyles, { allowEmpty: true })
    .pipe(concat('bundle.css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(config.pathDist.css));
}
exports.copycss = copycss;

// copy js
function copyjs() {
  return src(config.injectScripts, { allowEmpty: true })
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(dest(config.pathDist.script));
}
exports.copyjs = copyjs;

// inject file to html
function injectFile() {
  return src(config.pathDist.html + '/*.html')
    .pipe(
      inject(
        src([`${config.pathDist.css}/*.css`, `${config.pathDist.script}/*.js`]),
        { relative: true }
      )
    )
    .pipe(dest(config.pathDist.html));
}
exports.inject = injectFile;


// local server
let serverOptions = {
  name: 'ENV：' + config.env,
  root: config.pathDist.html,
  host: '0.0.0.0',
  port: 8000,
  livereload: true,
};
if (config.proxyOptions.changeOrigin) {
  serverOptions = {
    name: 'ENV：' + config.env,
    root: config.pathDist.html,
    host: '0.0.0.0',
    port: 8000,
    livereload: true,
    middleware: () => {
      return [proxy('/api', config.proxyOptions)];
    },
  };
}
function server(done) {
  const isExist = fs.existsSync(path.join(serverOptions.root));
  if (!isExist) {
    throw Error(`${serverOptions.root} 目录不存在`);
  }
  connect.server(serverOptions);
  done();
}
exports.server = server;

// watch
function watchList(done) {
  watch(config.pathSrc.html + '/**/*.html', series(html, injectFile));
  watch(config.pathSrc.css + '/*.less', series(styles));
  watch(config.pathSrc.image + '/**/*', series(images));
  watch(config.pathSrc.script + '/*.js', series(scripts));
  done();
}
exports.watch = watchList;

// clean
function clean() {
  return del([config.pathDist.html + '/**']).then(() => {
    console.log(`${config.project} 项目初始化清理完成...`);
  });
}
exports.clean = clean;

// default
exports.default = series(parallel(server, watchList));

// build
exports.build = series(
  clean,
  html,
  styles,
  images,
  scripts,
  copycss,
  copyjs,
  injectFile,
  (done) => {
    console.log(`${config.project} 项目初始化构建完成...`);
    done();
  }
);
