import {join} from 'path';
import {PORT, APP_DEST} from '../config';
// Live CSS Reload &amp; Browser Syncing
// https://www.npmjs.com/package/browser-sync
import * as browserSync from 'browser-sync';

let runServer = () => {
  let routes:any = {
    [`/${APP_DEST}`]: APP_DEST,
    '/node_modules': 'node_modules',

    // TODO: definitelly wrong :(, but it works at least :)
    '/node_modules/traceur.js': 'node_modules/traceur/bin/traceur.js',
    // npm-scopes for different colabo puzzles
    // TODO: hopefully we can avoid it
    // (with the ng cli and webpack it is not necessary)
    '/node_modules/@colabo-knalledge': join(APP_DEST, 'dev_puzzles/knalledge'),
    '/node_modules/@colabo-puzzles': join(APP_DEST, 'dev_puzzles/puzzles'),

    '/bower_components': 'bower_components',
    // fixes problems with refering /app/components files from dev_puzzles
    '/app': join(APP_DEST),
    '/app/images': join(APP_DEST, 'images'),
    // '/dev_puzzles': join(APP_DEST, 'dev_puzzles'),
    '/dev_puzzles': 'dev_puzzles',
    // current (?) hack for wrong mapping coming from code (like `/dev_puzzles`)
    // that is outside the `app` folder
    // example: referencing the path:
    // ```js
    // import {KnalledgeMapViewService} from '../../app/components/knalledgeMap/knalledgeMapViewService';
    // ```
    // '/app/components': join(APP_DEST, 'components')
    // '/app/components': 'app/components'
    '/app/components': join(APP_DEST, 'components')
  };
  // https://www.browsersync.io/docs/options/
  browserSync({
    middleware: [require('connect-history-api-fallback')()],
    port: PORT,
    startPath: '/',

    // logLevel: "debug",
    // logConnections: true,
    // logFileChanges: true,

    server: {
      baseDir: APP_DEST,
      directory: true,
      routes: routes
    }
  });
};

let listen = () => {
  // if (ENABLE_HOT_LOADING) {
  //   ng2HotLoader.listen({
  //     port: HOT_LOADER_PORT,
  //     processPath: file => {
  //       return file.replace(join(PROJECT_ROOT, APP_SRC), join('dist', 'dev'));
  //     }
  //   });
  // }
  runServer();
};

let changed = files => {
  if (!(files instanceof Array)) {
    files = [files];
  }
  // if (ENABLE_HOT_LOADING) {
  //   ng2HotLoader.onChange(files);
  // } else {
    console.log("[code_change tools] reloading browser with files: ", files);
    browserSync.reload(files);
  //}
};

export { listen, changed };
