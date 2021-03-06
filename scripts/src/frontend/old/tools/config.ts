import {readFileSync} from 'fs';
import {argv} from 'yargs';
import {normalize, join} from 'path';
import * as chalk from 'chalk';

export interface IDependency {
    src: string;
    inject?: string | boolean;
    asset?: boolean; // if set to true it will be copied to final destination
    dest?: string;
    noNorm?: boolean; // if true, dependency will not get normalize with normalizeDependencies()
}

// http://stackoverflow.com/questions/12787781/type-definition-in-object-literal-in-typescript
export interface IDependencyStructure {
    APP_ASSETS: IDependency[];
    NPM_DEPENDENCIES: IDependency[];
    DEV_NPM_DEPENDENCIES: IDependency[];
    PROD_NPM_DEPENDENCIES: IDependency[];
}

var PluginsConfig = require('../app/js/config/config.plugins');

console.log("Plugins.gardening: ", PluginsConfig.plugins.gardening);
// --------------
// Configuration.

const ENVIRONMENTS = {
    DEVELOPMENT: 'dev',
    PRODUCTION: 'prod'
};


export const SUB_PROJECT_NAME = argv['sub-project'] || PluginsConfig.project.name;

export const SUB_PROJECT = PluginsConfig.project.subProjects[SUB_PROJECT_NAME];

console.log('__dirname: ', __dirname);
// console.log("SUB_PROJECT: ", SUB_PROJECT);

export const PORT = argv['port'] || PluginsConfig.project.port || 8000;
export const PROJECT_ROOT = normalize(join(__dirname, '..'));
export const ENV = getEnvironment();
export const DEBUG = argv['debug'] || false;
export const DOCS_PORT = argv['docs-port'] || 4003;
export const COVERAGE_PORT = argv['coverage-port'] || 4004;
export const APP_BASE = argv['base'] || '/';

export const ENABLE_HOT_LOADING = !!argv['hot-loader'];
export const HOT_LOADER_PORT = 5578;

export const BOOTSTRAP_MODULE = ENABLE_HOT_LOADING ?
    SUB_PROJECT.BOOTSTRAP_MODULE_HOT_LOADER : SUB_PROJECT.BOOTSTRAP_MODULE;

export const APP_TITLE = SUB_PROJECT.APP_TITLE;

export const APP_SRC = SUB_PROJECT.APP_SRC;
export const APP_SRC_FROM_HERE = join('..', APP_SRC);
export const ASSETS_SRC = `${APP_SRC}/assets`;

export const TOOLS_DIR = 'tools';
export const DOCS_DEST = 'docs';
export const DIST_DIR = 'dist';
export const DEV_DEST = `${DIST_DIR}/dev`;
export const PROD_DEST = `${DIST_DIR}/prod`;
export const TMP_DIR_BASE = ENV === 'dev' ? `${DIST_DIR}/dev` : `${DIST_DIR}/tmp`;
// this is necessary to help Atom to work with ` character
export const TMP_DIR = ENV === 'dev' ? `${DIST_DIR}/dev` : `${DIST_DIR}/tmp/app`;
// this is necessary to help Atom to work with ` character
export const APP_DEST = `${DIST_DIR}/${ENV}`;
export const APP_DEST_FROM_HERE = join('..', APP_DEST);
export const CSS_DEST = `${APP_DEST}/css`;
export const FONTS_DEST = `${APP_DEST}/fonts`;
export const JS_DEST = `${APP_DEST}/js`;
export const APP_ROOT = ENV === 'dev' ? `${APP_BASE}${APP_DEST}/` : `${APP_BASE}`;
// this is necessary to help Atom to work with ` character
export const DEV_PUZZLES_SRC = SUB_PROJECT.DEV_PUZZLES_SRC;
export const DEV_PUZZLES_DEST = `${DIST_DIR}/${ENV}/${SUB_PROJECT.DEV_PUZZLES}`;
export const VERSION = appVersion();

export const CSS_PROD_BUNDLE = 'all.css';
export const JS_PROD_SHIMS_BUNDLE = 'shims_bundle.js';
export const JS_PROD_APP_BUNDLE = 'app_bundle.js';

export const VERSION_NPM = '2.14.2';
export const VERSION_NODE = '4.0.0';

console.log('APP_SRC: %s, APP_SRC_FROM_HERE: ', APP_SRC, APP_SRC_FROM_HERE);
console.log('APP_DEST: %s, APP_DEST_FROM_HERE: ', APP_DEST, APP_DEST_FROM_HERE);

export const COMPASS_CONFIG = SUB_PROJECT.COMPILATION.COMPASS;
console.log("SUB_PROJECT: ", SUB_PROJECT);

export var BUILD_SEQUENCE: [
  'clean.dev', // cleans prod (folder, ...)
  'build.compass', // compiles COMPASS files -> APP_DEST
  'build.assets.dev',   // copies asset files (not *.ts) from APP_SRC -> APP_DEST
                        // (and dependencies assets -> d.dest)
  'tslint', // ts linting
  'build.js.dev', // compiles ts files, replace templates and adds sourcemaps -> APP_DEST
  'build.index.dev' // inject all dependencies under coresponding placeholders
];

// states used to support smart building process
export var WATCH_BUILD_STATE:any = {
  printCommands: true, // print commands on any action
  autoBuild: false, // build after any watch trigger
  autoReload: true, // reload browser after any build
  notifyOnReload: true, // audio notify on reloading the browser
  everyBuildIsFull: false // should every triggered/requested build be full ?
};

// set of watch rules that will set particular steps of building process in response
export var WATCH_BUILD_RULES:any = {
};

// COMPASS/SASS rule
WATCH_BUILD_RULES[join(APP_SRC, '**/*.scss')] = {
  steps: {
    'clean.dev': false,
    'build.compass': true,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// JS rule
WATCH_BUILD_RULES[join(APP_SRC, '**/*.js')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// HTML rule
WATCH_BUILD_RULES[join(APP_SRC, '**/*.html')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// TS rule
WATCH_BUILD_RULES[join(APP_SRC, '**/*.ts')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': false,
    'tslint': true,
    'build.js.dev': true,
    'build.index.dev': false,
  }
};

// DEV_PUZZLES_SRC related
// COMPASS/SASS rule
WATCH_BUILD_RULES[join(DEV_PUZZLES_SRC, '**/*.scss')] = {
  steps: {
    'clean.dev': false,
    'build.compass': true,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// JS rule
WATCH_BUILD_RULES[join(DEV_PUZZLES_SRC, '**/*.js')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// HTML rule
WATCH_BUILD_RULES[join(DEV_PUZZLES_SRC, '**/*.html')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// TS rule
WATCH_BUILD_RULES[join(DEV_PUZZLES_SRC, '**/*.ts')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': false,
    'tslint': true,
    'build.js.dev': true,
    'build.index.dev': false,
  }
};

export var WATCH_BUILD_CHANGED_FILES = {};

// the set of building tasks that are set to be built on the next build
export var WATCH_CHANGED:any = {
  'clean.dev': false,
  'build.compass': false,
  'build.assets.dev': false,
  'tslint': false,
  'build.js.dev': false,
  'build.index.dev': false
};

/**
 * Replaces string version(s) of APP paths with real path values and returns string path
 * @param  {string[]|string} pathArray array of pa
 * @return {string} substituted path
 */
export function replaceStrPaths(pathArray:string[]|string, parentPath?:string):string{
    if(typeof pathArray === 'string') pathArray = [<string>pathArray];

    var path = "";
    for(var pI in <string[]>pathArray){
      var pathPart = pathArray[pI];
      switch(pathPart){
          case 'APP_SRC_STR':
              pathPart = APP_SRC;
              break;
          case 'APP_DEST_STR':
              pathPart = APP_DEST;
              break;
          case '.':
              pathPart = parentPath ? parentPath : pathPart;
              break;
      }
      path += (path.length > 0) ? "/"+pathPart : pathPart;
    }
    return path;
}

// fixing/patching project variables
var inlineNg1 = SUB_PROJECT.COMPILATION.INLINE_NG1.SRC;
for(var i in inlineNg1){
    if(Array.isArray(inlineNg1[i])){
        console.log("inlineNg1.before: ", inlineNg1[i]);
        inlineNg1[i] = replaceStrPaths(inlineNg1[i]);
        console.log("inlineNg1.after: ", inlineNg1[i]);
    }
}

export const NG2LINT_RULES = customRules();

// Declare local files that needs to be injected
export const SUB_PROJECTS_FILE:IDependencyStructure = {
    APP_ASSETS: [
        // (NG2-) MATERIAL
        { src: 'ng2-material/font/MaterialIcons-Regular.*', asset: true, dest: CSS_DEST }
    ],
    NPM_DEPENDENCIES: [
        // LIBS
<<<<<<< HEAD:src/frontend/tools/config.ts
        { src: join(APP_SRC, 'js/lib/debug.js'), inject: 'libs', noNorm: true },
=======
>>>>>>> cf-ng5:src/frontend/old/tools/config.ts
        { src: join(APP_SRC, '../bower_components/halo/index.js'), inject: 'libs', noNorm: true },
        // https://github.com/asvd/dragscroll
        { src: join(APP_SRC, '../node_modules/dragscroll/dragscroll.js'), inject: 'libs', noNorm: true },

        // KNALLEDGE APP
        { src: join(APP_SRC, 'js/config/config.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/config/config.env.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/config/config.plugins.js'), inject: true, noNorm: true },


        // COMPONENTS
        { src: join(APP_SRC, 'components/puzzles.js'), inject: true, noNorm: true },

        // PLUGINS: TODO: We want to avoid hardoced registering plugins here!
        // TODO: should we add all dependencies to the all components
        // that are not statically imported
        // Example: components/knalledgeMap/main.js imports
        // components/topPanel/topPanel.js only if the config.plugins.js says so


        // CSS
        // LIBS
        { src: join(APP_SRC, 'css/libs/bootstrap/bootstrap.css'), inject: true, dest: CSS_DEST, noNorm: true },
        // bootstrap 4
        { src: 'bootstrap/dist/css/bootstrap.css', inject: true, dest: CSS_DEST },

        { src: join(APP_SRC, 'css/libs/bootstrap/bootstrap.css'), inject: true, dest: CSS_DEST, noNorm: true },

        // KNALLEDGE CORE
        { src: join(APP_SRC, 'css/libs/wizard/ngWizard.css'), inject: true, dest: CSS_DEST, noNorm: true },

        { src: join(APP_SRC, 'css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
        { src: join(APP_SRC, '../bower_components/halo/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },

        // KNALLEDGE PLUGINS, TODO: we want to avoid hardoced registering plugins here

        // (NG2-) MATERIAL
        // @angular/material theme
        { src: '@angular/material/core/theming/prebuilt/purple-green.css', inject: true, dest: CSS_DEST },
        { src: 'ng2-material/ng2-material.css', inject: true, dest: CSS_DEST },
        { src: 'ng2-material/font/font.css', inject: true, dest: CSS_DEST }
    ],
    DEV_NPM_DEPENDENCIES: [
    ],
    PROD_NPM_DEPENDENCIES: [
        // ng1 templates (build.js.prod:inlineNg1Templates())
        { src: join(TMP_DIR, 'js/ng1Templates.js'), inject: true, noNorm: true },
        { src: join(TMP_DIR, '..', DEV_PUZZLES_SRC, 'js/ng1Templates.js'), inject: true, noNorm: true }
    ]
};

// injecting puzzle dependencies
var npmDependencies = SUB_PROJECTS_FILE.NPM_DEPENDENCIES;
var puzzlesConfig = PluginsConfig.plugins.puzzles;
var puzzlesBuild = PluginsConfig.plugins.puzzlesBuild;

import {injectPuzzlesDependencies} from './colabo/puzzleLoader';
injectPuzzlesDependencies(npmDependencies, puzzlesConfig, puzzlesBuild, COMPASS_CONFIG);

// add app.js after all other external puzzles-containers' configs are provided
// so app.js is capable of accessing external puzzles-containers' configs
SUB_PROJECTS_FILE.NPM_DEPENDENCIES.push(
  { src: join(APP_SRC, 'js/app.js'), inject: true, noNorm: true }
);


if (ENABLE_HOT_LOADING) {
    console.log(chalk.bgRed.white.bold('The hot loader is temporary disabled.'));
    process.exit(0);
}

// Declare NPM dependencies (Note that globs should not be injected).
const NPM_DEPENDENCIES: IDependency[] = [
    { src: 'core-js/client/shim.min.js', inject: 'shims' },
    { src: 'systemjs/dist/system-polyfills.src.js', inject: 'shims' },
    { src: 'reflect-metadata/Reflect.js', inject: 'shims' },
    { src: 'systemjs/dist/system.src.js', inject: 'shims' },

    { src: join(APP_SRC, 'js/lib/jquery/jquery.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/bootstrap/bootstrap.js'), inject: 'libs', noNorm: true },

    { src: 'angular/angular.js', inject: 'libs' },
    { src: 'angular-route/angular-route.js', inject: 'libs' },
    { src: 'angular-sanitize/angular-sanitize.js', inject: 'libs' },
    { src: 'angular-resource/angular-resource.js', inject: 'libs' },
    { src: 'angular-animate/angular-animate.js', inject: 'libs' },
    { src: 'ngstorage/ngStorage.js', inject: 'libs' },

    { src: join(APP_SRC, 'js/lib/deepAssign.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/tween/tween.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/socket.io/socket.io.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/ui-bootstrap/ui-bootstrap-tpls-0.12.1.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/wizard/ngWizard.js'), inject: 'libs', noNorm: true },
    // { src: join(APP_SRC, 'js/lib/ng2-file-upload/ng2-file-upload.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/socket.io/angular.socket.io.js'), inject: 'libs', noNorm: true },

    { src: 'hammerjs/hammer.js', inject: 'libs' },
    { src: 'rxjs/bundles/Rx.js', inject: 'libs' },
];

const DEV_NPM_DEPENDENCIES: IDependency[] = [
    // { src: 'angular2/es6/dev/src/testing/shims_for_IE.js', inject: 'shims' },
    { src: 'zone.js/dist/zone.js', inject: 'shims' },
];

const PROD_NPM_DEPENDENCIES: IDependency[] = [
    { src: 'zone.js/dist/zone.js', inject: 'shims' },
];

console.log("NPM_DEPENDENCIES: ", NPM_DEPENDENCIES);
console.log("DEV_NPM_DEPENDENCIES: ", DEV_NPM_DEPENDENCIES);
console.log("SUB_PROJECTS_FILE.NPM_DEPENDENCIES: ", SUB_PROJECTS_FILE.NPM_DEPENDENCIES);
console.log("SUB_PROJECTS_FILE.DEV_NPM_DEPENDENCIES: ", SUB_PROJECTS_FILE.DEV_NPM_DEPENDENCIES);
console.log("SUB_PROJECTS_FILE.APP_ASSETS: ", SUB_PROJECTS_FILE.APP_ASSETS);

export const DEV_DEPENDENCIES = normalizeDependencies(NPM_DEPENDENCIES.
    concat(DEV_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.NPM_DEPENDENCIES,
    SUB_PROJECTS_FILE.DEV_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.APP_ASSETS)
);

export const PROD_DEPENDENCIES = normalizeDependencies(NPM_DEPENDENCIES.
    concat(PROD_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.NPM_DEPENDENCIES,
    SUB_PROJECTS_FILE.PROD_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.APP_ASSETS)
);

export const DEPENDENCIES = ENV === 'dev' ? DEV_DEPENDENCIES : PROD_DEPENDENCIES;
console.log(chalk.bgWhite.blue.bold(' DEPENDENCIES: '), chalk.blue(JSON.stringify(DEPENDENCIES)));

// ----------------
// SystemsJS Configuration.

var config = {
    defaultJSExtensions: true,
    defaultExtension: "js",
    // map tells the System loader where to look for things
    map: {
      app: 'app',
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      // '@angular/material': 'npm:@angular/material/bundles/material.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',

      // '@colabo-puzzles': '/dev_puzzles/puzzles/',

      'rxjs': 'npm:rxjs',
      "ng2-material": "ng2-material/index.js",
      "components/knalledgeMap/main": "components/knalledgeMap/main.js",
      "@ng-bootstrap/ng-bootstrap": "npm:@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js",
      // TODO: probably not working, clean out or fix
      "traceur":"npm:traceur/bin/traceur.js",
      "traceur.js":"npm:traceur/bin/traceur.js"
    },

    // TODO: should we add all dependencies to the all components
    // that are not statically imported
    // Example: components/knalledgeMap/main.js imports
    // components/topPanel/topPanel.js only if the config.plugins.js says so
    // it seems it doesn't make builder to inject it in the app_bundle.js

    // https://github.com/systemjs/systemjs/blob/master/docs/module-formats.md
    // https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#meta
    meta: {
        "components/knalledgeMap/main": {
            format: "global",
            deps: ["components/topPanel/topPanel"]
        },
        "components/topPanel/topPanel": {
            build: true
        }
    },
    packageConfigPaths: ['./node_modules/*/package.json',
        './node_modules/@angular/*/package.json',
        './node_modules/@angular2-material/*/package.json',
        './node_modules/@ng-bootstrap/ng-bootstrap/package.json'
    ],
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
        "symbol-observable": {
          main: "index.js"
        },
        app: {
          main: './js/app2.js',
          defaultExtension: 'js'
        },
        rxjs: {
          defaultExtension: 'js'
        },
        '@angular/material': {
          format: 'cjs',
          main: 'material.umd.js'
        },
        // TODO: probably not working, clean out or fix
        traceur:{
          main: 'traceur'
        }
    },
    // paths serve as alias
    paths: {
        [BOOTSTRAP_MODULE]: `${APP_BASE}${BOOTSTRAP_MODULE}`,
        // 'rxjs/*': `${APP_BASE}rxjs/*`,
        '*': `./node_modules/*`,
        'dist/*': `./dist/*`,

        "bootstrap": "/bootstrap",
        'npm:': 'node_modules/',
    }
};

// put the names of any of your Material components here
var materialPkgs = [
    'core',
    'checkbox',
    'sidenav',
    'checkbox',
    'input',
    'progress-bar',
    'progress-circle',
    'radio',
    'tabs',
    'toolbar'
];

// for(var pI in materialPkgs){
//     var pkg = materialPkgs[pI];
//     config.packages['@angular2-material/'+pkg] = {main: pkg+'.js'};
// }

// put the names of any of your Angular components here
var angularPkgs = [
    'common', 'compiler', 'core',
    'forms', 'http', 'platform-browser',
    'platform-browser-dynamic', 'router',
    'router-deprecated', 'upgrade'
];
// for(var pI in angularPkgs){
//     var pkg = angularPkgs[pI];
//     config.packages['@angular/'+pkg] = {main: 'index.js', defaultExtension: 'js'};
// }
const SYSTEM_CONFIG_DEV = config;

// TODO: Fix
// const SYSTEM_CONFIG_PROD = {
//   defaultJSExtensions: true,
//   bundles: {
//     'bundles/app': ['bootstrap']
//   }
// };

// export const SYSTEM_CONFIG = ENV === 'dev' ? SYSTEM_CONFIG_DEV : SYSTEM_CONFIG_PROD;

export const SYSTEM_CONFIG = SYSTEM_CONFIG_DEV;

console.log("[config.ts] SYSTEM_CONFIG: ", JSON.stringify(SYSTEM_CONFIG));

// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md
// https://github.com/ModuleLoader/es6-module-loader/blob/master/docs/loader-config.md#paths-implementation
config.paths[`${TMP_DIR}/*`] = `${TMP_DIR}/*`;
// config.paths['*'] = 'node_modules/*';

export const SYSTEM_BUILDER_CONFIG = config;

console.log("[config.ts] SYSTEM_BUILDER_CONFIG: ", JSON.stringify(SYSTEM_BUILDER_CONFIG));

// export const SYSTEM_BUILDER_CONFIG = {
//     defaultJSExtensions: true,
//     // https://github.com/ModuleLoader/es6-module-loader/blob/master/docs/loader-config.md#paths-implementation
//     paths: {
//         [`${TMP_DIR}/*`]: `${TMP_DIR}/*`,
//         '*': 'node_modules/*'
//     }
// };

// --------------
// Private.

// finds the full path for a dependency, like paths for packages from node_modules
// so we do not need to refer to them with node_modules prefixes
// NOTE: this is not true for non-js files
function normalizeDependencies(deps: IDependency[]) {
    deps
        .filter((d: IDependency) => !/\*/.test(d.src)) // Skip globs
        .forEach((d: IDependency) => { if (d.noNorm !== true) d.src = require.resolve(d.src); });
    return deps;
}

function appVersion(): number | string {
    var pkg = JSON.parse(readFileSync('package.json').toString());
    return pkg.version;
}

function customRules(): string[] {
    var lintConf = JSON.parse(readFileSync('tslint.json').toString());
    return lintConf.rulesDirectory;
}

function getEnvironment() {
    let base: string[] = argv['_'];
    let env = ENVIRONMENTS.DEVELOPMENT;
    let prodKeyword = !!base.filter(o => o.indexOf(ENVIRONMENTS.PRODUCTION) >= 0).pop();
    if (base && prodKeyword || argv['env'] === ENVIRONMENTS.PRODUCTION
    || process.env.NODE_ENV === 'prod'
    || process.env.NODE_ENV === 'production') {
        env = ENVIRONMENTS.PRODUCTION;
    }
    console.log("[getEnvironment] ENV: ", env);

    return env;
}
