// gulp --gulpfile gulpfile_.js
'use strict';

// http://javascriptplayground.com/blog/2014/02/an-intro-to-gulp/

// http://javascriptplayground.com/blog/2014/02/an-intro-to-gulp/
// https://gist.github.com/aaronwaldon/8657432

var path = require('path');
var join = path.join;
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var compass = require('gulp-compass');

//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
  title: 'Gulp',
  icon: require.resolve('gulp-notify/assets/gulp-error.png')
};

//error notification settings for plumber
var plumberErrorHandler = {
  errorHandler: notify.onError({
    title: notifyInfo.title,
    icon: notifyInfo.icon,
    message: 'Error: <%= error.message %>'
  })
};

const GENERIC_IN_SASS = false;

// let scssFiles = ['./src/buttons/templates/sass/*.scss'];
// let scssFiles = [path.join(appPath, '**/sass/*.scss')];

console.log('__dirname: ', __dirname);

var appPath;
var projectPath;
var distPath;
var distPathCss;
var scssFiles;

// if(GENERIC_IN_SASS){
// 	var appPath = 'src';
//
// 	var projectPath = join(__dirname, appPath);
// 	var distPath = 'src';
// 	var distPathCss = join(distPath, '');
// 	var scssFiles = [join(appPath, '**/sass/*.scss')];
// }else{
// 	// drawback: we have to run compass for each path separately
// 	var appPath = 'src/buttons/templates';
// 	var projectPath = join(__dirname, appPath, 'sass');
// 	var distPath = 'src/buttons/templates';
// 	var distPathCss = join(distPath, '');
// 	var scssFiles = [join(appPath, '*.scss')];
// }
//

if(GENERIC_IN_SASS) {
  appPath = 'src';

  projectPath = join(__dirname, appPath);
  distPath = 'src';
  distPathCss = join(distPath, '');
  // scssFiles = ['./**/sass/*.scss'];
  scssFiles = [join(appPath, '**/sass/*.scss')];
}else {
  // drawback: we have to run compass for each path separately
  appPath = 'src/buttons/templates';
  projectPath = join(__dirname, appPath, 'sass');
  distPath = 'src/buttons/templates';
  distPathCss = join(distPath, '');
  scssFiles = [join(appPath, '*.scss')];
}
console.log('projectPath: ', projectPath);
console.log('scssFiles: ', scssFiles);
console.log('distPathCss: ', distPathCss);

// https://www.npmjs.com/package/gulp-compass
// https://www.npmjs.com/package/gulp-compass#sass
// http://stackoverflow.com/questions/29481629/stylesheets-must-be-in-the-sass-directory-error-with-gulp-compass
// https://github.com/appleboy/gulp-compass/issues/61
gulp.task('compass', function() {
  gulp.src(scssFiles)
    .pipe(plumber(plumberErrorHandler))
    .pipe(compass({
      outputStyle: 'nested',
      environment: 'development',
      noLineComments: true,
      require: ['susy', 'breakpoint'],
      trace: true,
      style: 'nested',
      relative: true,
      sourcemap: true,
      css: distPathCss,
      sass: projectPath,
    //   add_import_path: projectPath + '/',
    //   project: projectPath + '/',
      task: 'compile' // 'watch'
    }))
	// doesn't have effect
    .pipe(gulp.dest(distPathCss+"/css"));
});

gulp.task('default', ['compass']);
