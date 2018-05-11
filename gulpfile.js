/* eslint-disable */
// sass = require('gulp-sass'),
var gulp = require('gulp'),
  path = require('path'),
  ngc = require('@angular/compiler-cli/src/main').main,
  rollup = require('gulp-rollup'),
  commonjs = require('rollup-plugin-commonjs');
  rename = require('gulp-rename'),
  cleancss = require('gulp-clean-css'),
  concatCss = require('gulp-concat-css'),
  fs = require('fs-extra'),
  runSequence = require('run-sequence'),
  resolve = require('rollup-plugin-node-resolve'),
  inlineResources = require('./tools/gulp/inline-resources');

const rootFolder = path.join(__dirname);
const srcFolder = path.join(rootFolder, 'src');
const tmpFolder = path.join(rootFolder, '.tmp');
const buildFolder = path.join(rootFolder, 'build');
const distFolder = path.join(rootFolder, 'dist');

/**
 * 1. Delete /dist folder
 */
gulp.task('clean:dist', function () {

  // Delete contents but not dist folder to avoid broken npm links
  // when dist directory is removed while npm link references it.
  return fs.emptyDirSync(distFolder);
});

/**
 * 2. Clone the /src folder into /.tmp. If an npm link inside /src has been made,
 *    then it's likely that a node_modules folder exists. Ignore this folder
 *    when copying to /.tmp.
 */
gulp.task('copy:source', function () {
  return gulp.src([`${srcFolder}/**/*`, `!${srcFolder}/node_modules`])
    .pipe(gulp.dest(tmpFolder));
});

/**
 * 3. Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
gulp.task('inline-resources', function () {
  return Promise.resolve()
    .then(() => inlineResources(tmpFolder));
});


/**
 * 4. Run the Angular compiler, ngc, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 *
 *    As of Angular 5, ngc accepts an array and no longer returns a promise.
 */
gulp.task('ngc', function () {
  ngc(['--project', `${tmpFolder}/tsconfig.es5.json`]);
  return Promise.resolve()
});

/**
 * 5. Run rollup inside the /build folder to generate our Flat ES module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:fesm', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
  // transform the files here.
    .pipe(rollup({

      // Bundle's entry point
      // See "input" in https://rollupjs.org/#core-functionality
      input: `${buildFolder}/index.js`,

      // Allow mixing of hypothetical and actual files. "Actual" files can be files
      // accessed by Rollup or produced by plugins further down the chain.
      // This prevents errors like: 'path/file' does not exist in the hypothetical file system
      // when subdirectories are used in the `src` directory.
      allowRealFiles: true,

      plugins: [
        resolve({
        // pass custom options to the resolve plugin
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      commonjs ({
        include: "node_modules/rxjs/**",
      })
      ],
      
      // A list of IDs of modules that should remain external to the bundle
      // See "external" in https://rollupjs.org/#core-functionality
      external: [
        '@angular/core',
        '@angular/common',
        '@angular/platform-browser',
        '@angular/forms',
        '@angular/common/http',
        '@angular/platform-browser/animations',
        '@angular/router',
        '@angular/animations',
        '@angular/cdk',
        '@angular/material',
        'rxjs/Observable',
        'rxjs/Subject',
        'rxjs/Subscription',
        'rxjs/operators/takeUntil',
        'rxjs/ReplaySubject',
        'rxjs/add/observable/of',
        'rxjs/add/operator/share',
        'rxjs/add/operator/catch',
        'rxjs/add/observable/throw',
        'rxjs/add/operator/map',
        'rxjs/add/operator/switchMap',
        'rxjs/add/operator/mergeMap',
        'rxjs/add/observable/fromPromise',
        'hammerjs', 'core-js', 'idb-keyval','web-animations-js', 'zone.js'
      ],

      output: {
        // Format of generated bundle
        // See "format" in https://rollupjs.org/#core-functionality
        format: 'es'
      }
    }))
    .pipe(gulp.dest(distFolder));
});

/**
 * 6. Run rollup inside the /build folder to generate our UMD module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:umd', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
  // transform the files here.
    .pipe(rollup({

      // Bundle's entry point
      // See "input" in https://rollupjs.org/#core-functionality
      input: `${buildFolder}/index.js`,

      // Allow mixing of hypothetical and actual files. "Actual" files can be files
      // accessed by Rollup or produced by plugins further down the chain.
      // This prevents errors like: 'path/file' does not exist in the hypothetical file system
      // when subdirectories are used in the `src` directory.
      allowRealFiles: true,
      plugins: [
        resolve({
          // pass custom options to the resolve plugin
          customResolveOptions: {
            moduleDirectory: 'node_modules'
          }
        }),
        commonjs ({
          include: "node_modules/rxjs/**",
        })
      ],
      // A list of IDs of modules that should remain external to the bundle
      // See "external" in https://rollupjs.org/#core-functionality
      external: [
        '@angular/core',
        '@angular/common',
        '@angular/platform-browser',
        '@angular/forms',
        '@angular/common/http',
        '@angular/platform-browser/animations',
        '@angular/router',
        '@angular/animations',
        '@angular/cdk',
        '@angular/material',
        'rxjs/Observable',
        'rxjs/Subject',
        'rxjs/Subscription',
        'rxjs/operators/takeUntil',
        'rxjs/ReplaySubject',
        'rxjs/add/observable/of',
        'rxjs/add/operator/share',
        'rxjs/add/operator/catch',
        'rxjs/add/observable/throw',
        'rxjs/add/operator/map',
        'rxjs/add/operator/switchMap',
        'rxjs/add/operator/mergeMap',
        'rxjs/add/observable/fromPromise',
        'hammerjs', 'core-js', 'idb-keyval','web-animations-js', 'zone.js'
      ],

      output: {
        // The name to use for the module for UMD/IIFE bundles
        // (required for bundles with exports)
        // See "name" in https://rollupjs.org/#core-functionality
        name: 'wickeyappstore',
        // Format of generated bundle
        // See "format" in https://rollupjs.org/#core-functionality
        format: 'umd',
        // Export mode to use
        // See "exports" in https://rollupjs.org/#danger-zone
        exports: 'named',
        // See "globals" in https://rollupjs.org/#core-functionality
        globals: {
          typescript: 'ts'
        }
      }

    }))
    .pipe(rename('wickeyappstore.umd.js'))
    .pipe(gulp.dest(distFolder));
});

/**
 * 7. Copy all the files from /build to /dist, except .js files. We ignore all .js from /build
 *    because with don't need individual modules anymore, just the Flat ES module generated
 *    on step 5.
 */
gulp.task('copy:build', function () {
  return gulp.src([`${buildFolder}/**/*`, `!${buildFolder}/**/*.js`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 8. Copy package.json from /src to /dist
 */
gulp.task('copy:manifest', function () {
  return gulp.src([`${srcFolder}/package.json`])
    .pipe(gulp.dest(distFolder));
});
/**
 * 8.5. Copy styles.css from /src to /dist
 * for sass and multiple files
 * .pipe(sass()).pipe(concatCss("styles.css"))
 */
gulp.task('copy:globalstyles', function () {
  return gulp.src([`${srcFolder}/styles.css`])
    .pipe(cleancss({compatibility: 'ie8'}))
    .pipe(gulp.dest(distFolder));
});

/**
 * 9. Copy README.md from / to /dist
 */
gulp.task('copy:readme', function () {
  return gulp.src([path.join(rootFolder, 'README.MD')])
    .pipe(gulp.dest(distFolder));
});

/**
 * 10. Delete /.tmp folder
 */
gulp.task('clean:tmp', function () {
  return deleteFolder(tmpFolder);
});

/**
 * 11. Delete /build folder
 */
gulp.task('clean:build', function () {
  return deleteFolder(buildFolder);
});

gulp.task('compile', function () {
  runSequence(
    'clean:dist',
    'copy:source',
    'inline-resources',
    'ngc',
    'rollup:fesm',
    'rollup:umd',
    'copy:build',
    'copy:manifest',
    'copy:globalstyles',
    'copy:readme',
    'clean:build',
    'clean:tmp',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
        deleteFolder(distFolder);
        deleteFolder(tmpFolder);
        deleteFolder(buildFolder);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

/**
 * Watch for any change in the /src folder and compile files
 */
gulp.task('watch', function () {
  gulp.watch(`${srcFolder}/**/*`, ['compile']);
});

gulp.task('clean', function (callback) {
  runSequence('clean:dist', 'clean:tmp', 'clean:build', callback);
});

gulp.task('build', function (callback) {
  runSequence('clean', 'compile', callback);
});

gulp.task('build:watch', function (callback) {
  runSequence('build', 'watch', callback);
});

gulp.task('default', ['build:watch']);

/**
 * Deletes the specified folder
 */
function deleteFolder(folder) {
  return fs.removeSync(folder);
}
