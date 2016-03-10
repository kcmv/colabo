import * as merge from 'merge-stream';
import {join} from 'path';
import {APP_SRC, APP_DEST, DEV_DEPENDENCIES} from '../config';

// copies set of asset files (not *.ts and *.scss) from APP_SRC to APP_DEST
//  it will copy js files, css, html files,
//  because in dev they should not be combined into bundles
export = function buildAssetsDev(gulp, plugins) {
  return function() {
    // https://www.npmjs.com/package/merge-stream
    return merge(copyProjectInternalAsets(), copyProjectExternalAsets());

    // copies all external asset dependencies (d.asset === true)
    // to their designated destionations (d.dest)
    function copyProjectExternalAsets() {
      var externalAssetFiles = DEV_DEPENDENCIES.filter(d => d.asset);
      // http://stackoverflow.com/questions/26784094/can-i-use-a-gulp-task-with-multiple-sources-and-multiple-destinations
      var tasks = externalAssetFiles.map(function(element) {
        // https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options
        return gulp.src(element.src)
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpdestpath-options
          .pipe(gulp.dest(element.dest));
      });

      return merge(...tasks);
    }

    // copies set of asset files (not *.ts and *.scss) from APP_SRC to APP_DEST
    //  it will copy js files, css, html files,
    function copyProjectInternalAsets() {
      var stream = gulp.src([
        join(APP_SRC, '**'),
        '!' + join(APP_SRC, '**', '*.ts'),
        '!' + join(APP_SRC, '**', '*.scss')
      ])
        .pipe(plugins.sniff("internal-assets", {captureFolders: true, captureFilenames: false}))
        .pipe(gulp.dest(APP_DEST));

        stream.on('end', function() {
            console.log("[build.assets.dev] internal-assets:", plugins.sniff.get("internal-assets"));
        });

      return stream;
    }
  };
}
