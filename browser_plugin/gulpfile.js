/* eslint-env node */

"use strict";

const autoprefixer = require("autoprefixer");
const babel = require("gulp-babel");
const csso = require("postcss-csso");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const minify = require("gulp-babel-minify");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const postcss_scss = require("postcss-scss");
const rename = require("gulp-rename");
const reporter = require("postcss-reporter");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const stylelint = require("stylelint");



// #############################################################################
// JS

function jsGulpTask(src, dest) {
  return gulp.src(src)
    .pipe(plumber({
      errorHandler: function() {
        this.emit("end");
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(rename({
      suffix: ".min",
    }))
    .pipe(babel())
    .pipe(minify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(dest));
}

gulp.task("js", function() {
  return jsGulpTask("src/js/*.js", "dest/js");
});

gulp.task("js-popup", function() {
  return jsGulpTask("src/js/*.js", "dest/js");
});


// #############################################################################
// SASS

gulp.task("sass-popup", function() {
  return gulp.src("src/popup/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss([
      stylelint(),
      reporter({
        clearReportedMessages: true
      }),
    ], {
      syntax: postcss_scss
    }))
    .pipe(sass().on("error", sass.logError))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(postcss([
      autoprefixer(),
      csso(),
    ]))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dest/popup/css/"));
});


// #############################################################################
// TASK

gulp.task("default", function() {
  gulp.watch("src/js/*.js", ["js"]);
  gulp.watch("src/popup/scss/**/*.scss", ["sass-popup"]);
});
