import {readFileSync} from 'fs';
import {argv} from 'yargs';
import {normalize, join} from 'path';
import * as chalk from 'chalk';

// --------------
// Configuration.

const ENVIRONMENTS = {
    DEVELOPMENT: 'dev',
    PRODUCTION: 'prod'
};

export const SUB_PROJECT_NAME = argv['sub-project'] || 'KNALLEDGE';
// export const SUB_PROJECT_NAME = argv['sub-project'] || 'BUTTONS';

const SUB_PROJECTS = {
    KNALLEDGE: {
        BOOTSTRAP_MODULE: 'js/app2',
        BOOTSTRAP_MODULE_HOT_LOADER: 'hot_loader_app2',
        SELECTOR: 'button-basic-usage',
        APP_SRC: 'app',
        APP_TITLE: 'KnAllEdge',
        COMPILATION: {}
    },
    BUTTONS: {
        BOOTSTRAP_MODULE: 'main',
        BOOTSTRAP_MODULE_HOT_LOADER: 'hot_loader_main',
        SELECTOR: 'button-basic-usage',
        APP_SRC: 'src/buttons',
        APP_TITLE: 'Angular 2 (with materials) - buttons',
        COMPILATION: {}
    }
};

export const SUB_PROJECT = SUB_PROJECTS[SUB_PROJECT_NAME];

console.log('__dirname: ', __dirname);
// console.log("SUB_PROJECT: ", SUB_PROJECT);

export const PORT = argv['port'] || 5555;
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
export const TMP_DIR = `${DIST_DIR}/tmp`;
export const APP_DEST = `${DIST_DIR}/${ENV}`;
export const APP_DEST_FROM_HERE = join('..', APP_DEST);
export const CSS_DEST = `${APP_DEST}/css`;
export const FONTS_DEST = `${APP_DEST}/fonts`;
export const JS_DEST = `${APP_DEST}/js`;
export const APP_ROOT = ENV === 'dev' ? `${APP_BASE}${APP_DEST}/` : `${APP_BASE}`;
export const VERSION = appVersion();

export const CSS_PROD_BUNDLE = 'all.css';
export const JS_PROD_SHIMS_BUNDLE = 'shims_bundle.js';
export const JS_PROD_APP_BUNDLE = 'app_bundle.js';

export const VERSION_NPM = '2.14.2';
export const VERSION_NODE = '4.0.0';

console.log('APP_SRC: %s, APP_SRC_FROM_HERE: ', APP_SRC, APP_SRC_FROM_HERE);
console.log('APP_DEST: %s, APP_DEST_FROM_HERE: ', APP_DEST, APP_DEST_FROM_HERE);

SUB_PROJECTS.KNALLEDGE.COMPILATION = {
    ADD_ANTICACHE_SUFIX: false,
    INLINE_NG1: {
        SRC: [join(APP_SRC, '**/*.tpl.html')]
    },
    INLINE: {
        USE_RELATIVE_PATHS: true
    },
    COMPASS: {
        // NOTE: !!!if true, this will output css files into sass folder!!!
        // due to [issue-61](https://github.com/appleboy/gulp-compass/issues/61)
        GENERIC: false,
        // if value of the path key is not set to object, default values will be considered
        PATHS: {
            '': {destDir: APP_SRC, cssDir: 'css'},
            'components/collaboPlugins': {destDir: APP_SRC, cssDir: 'css'},
            'components/knalledgeMap': {destDir: APP_SRC, cssDir: 'css'},
            'components/login': {destDir: APP_SRC, cssDir: 'css'},
            'components/notify': {destDir: APP_SRC, cssDir: 'css'},
            'components/ontov': {destDir: APP_SRC, cssDir: 'css'},
            'components/rima': {destDir: APP_SRC, cssDir: 'css'},
            'components/topiChat': {destDir: APP_SRC, cssDir: 'css'}
        }
    }
};

SUB_PROJECTS.BUTTONS.COMPILATION = {
    ADD_ANTICACHE_SUFIX: true,
    INLINE: {
        USE_RELATIVE_PATHS: true
    },
    COMPASS: {
        // NOTE: !!!if true, this will output css files into sass folder!!!
        // due to [issue-61](https://github.com/appleboy/gulp-compass/issues/61)
        GENERIC: false,
        PATHS: ['templates']
    }
};

export const COMPASS_CONFIG = SUB_PROJECT.COMPILATION.COMPASS;
console.log("SUB_PROJECT: ", SUB_PROJECT);

export const NG2LINT_RULES = customRules();

interface IDependency {
    src: string;
    inject: string | boolean;
    asset?: boolean; // if set to true it will be copied to final destination
    dest?: string;
    noNorm?: boolean; // if true, dependency will not get normalize with normalizeDependencies()
}

// Declare local files that needs to be injected
const SUB_PROJECTS_FILES = {
KNALLEDGE: {
    APP_ASSETS: [
    // (NG2-) MATERIAL
        { src: 'ng2-material/dist/MaterialIcons-Regular.*', asset: true, dest: CSS_DEST }
    ],
    NPM_DEPENDENCIES: [
    // LIBS
        { src: join(APP_DEST, 'js/lib/debug.js'), inject: 'libs', noNorm: true},
        { src: join(APP_SRC, '../bower_components/debugpp/index.js'), inject: 'libs', noNorm: true},
        { src: join(APP_SRC, '../bower_components/halo/index.js'), inject: 'libs', noNorm: true},
        { src: join(APP_SRC, '../components/utils/index.js'), inject: 'libs', noNorm: true},

    // KNALLEDGE APP
        { src: join(APP_DEST, 'js/config/config.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/config/config.env.js'), inject: true, noNorm: true},

		{ src: join(APP_DEST, 'js/interaction/interaction.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/interaction/moveAndDrag.js'), inject: true, noNorm: true},
        // { src: join(APP_DEST, 'js/interaction/mapInteraction.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/interaction/keyboard.js'), inject: true, noNorm: true},

    // KNALLEDGE CORE
		{ src: join(APP_DEST, 'js/knalledge/index.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/kNode.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/kEdge.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/kMap.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/WhoAmI.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/HowAmI.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/WhatAmI.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/vkNode.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/vkEdge.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/state.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapStructure.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapLayout.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapVisualization.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapLayoutTree.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapVisualizationTree.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapLayoutFlat.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapVisualizationFlat.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapLayoutGraph.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapVisualizationGraph.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/mapManager.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/knalledge/map.js'), inject: true, noNorm: true},

    // COMPONENTS

		{ src: join(APP_DEST, 'js/mcm/mcm.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/mcm/mcm.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/mcm/map.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'js/mcm/entitiesToolset.js'), inject: true, noNorm: true},

		{ src: join(APP_DEST, 'components/collaboPlugins/js/services.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/collaboPlugins/js/directives.js'), inject: true, noNorm: true},

		{ src: join(APP_DEST, 'components/knalledgeMap/js/directives.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/knalledgeMap/js/services.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/rima/js/directives.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/rima/js/services.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/rima/js/filters.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/notify/js/directives.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/notify/js/services.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/topiChat/js/directives.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/topiChat/js/services.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/login/js/directives.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/login/js/services.js'), inject: true, noNorm: true},
        { src: join(APP_DEST, 'components/collaboBroadcasting/js/services.js'), inject: true, noNorm: true},

	// PLUGINS: TODO: We want to avoid hardoced registering plugins here!
		// { src: join(APP_DEST, 'components/ontov/js/vendor/jquery-1.8.3.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/ontov/js/vendor/underscore-1.8.3.min.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/ontov/js/vendor/backbone-1.1.2.min.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/ontov/js/vendor/query-engine.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/ontov/js/vendor/dependencies.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/ontov/js/vendor/visualsearch.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/ontov/js/services.js'), inject: true, noNorm: true},
		{ src: join(APP_DEST, 'components/ontov/js/directives.js'), inject: true, noNorm: true},

    // ng1 registration and bootstrap
        // { src: join(APP_DEST, 'components/knalledgeMap/knalledgeMapPolicyService.js'), inject: true, noNorm: true},
        // { src: join(APP_DEST, 'components/knalledgeMap/knalledgeMapViewService.js'), inject: true, noNorm: true},
        // { src: join(APP_DEST, 'js/app_pre.js'), inject: true, noNorm: true},
        { src: join(APP_DEST, 'js/app.js'), inject: true, noNorm: true},

    // CSS
    // LIBS
		{ src: join(APP_SRC, 'css/libs/bootstrap/bootstrap.css'), inject: true, dest: CSS_DEST , noNorm: true},
		{ src: join(APP_SRC, 'css/libs/textAngular/textAngular.css'), inject: true, dest: CSS_DEST , noNorm: true},

    // KNALLEDGE CORE
		{ src: join(APP_SRC, 'css/libs/wizard/ngWizard.css'), inject: true, dest: CSS_DEST , noNorm: true},

        { src: join(APP_SRC, 'css/default app.css'), inject: true, dest: CSS_DEST, noNorm: true },
		{ src: join(APP_SRC, 'css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
		{ src: join(APP_SRC, 'components/knalledgeMap/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
		{ src: join(APP_SRC, 'components/knalledgeMap/css/graph.css'), inject: true, dest: CSS_DEST, noNorm: true },
        { src: join(APP_SRC, '../bower_components/halo/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true},
		{ src: join(APP_SRC, 'components/rima/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
		{ src: join(APP_SRC, 'components/login/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
		{ src: join(APP_SRC, 'components/notify/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
		{ src: join(APP_SRC, 'components/topiChat/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
		{ src: join(APP_SRC, 'components/collaboPlugins/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },

	// KNALLEDGE PLUGINS, TODO: we want to avoid hardoced registering plugins here
		{ src: join(APP_SRC, 'components/ontov/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
		{ src: join(APP_SRC, 'components/ontov/css/visualsearch/visualsearch.css'), inject: true, dest: CSS_DEST, noNorm: true },

    // (NG2-) MATERIAL
        { src: 'ng2-material/dist/ng2-material.css', inject: true, dest: CSS_DEST },
        { src: 'ng2-material/dist/font.css', inject: true, dest: CSS_DEST }
    ],
    DEV_NPM_DEPENDENCIES: [
    ],
    PROD_NPM_DEPENDENCIES: [
        // ng1 templates (build.js.prod:inlineNg1Templates())
                { src: join(TMP_DIR, 'js/ng1Templates.js'), inject: true, noNorm: true}
    ]
},
BUTTONS: {
    APP_ASSETS: [
        { src: 'ng2-material/dist/MaterialIcons-Regular.*', asset: true, dest: CSS_DEST }
    ],
    NPM_DEPENDENCIES: [
    ],
    DEV_NPM_DEPENDENCIES: [
        { src: 'ng2-material/dist/ng2-material.css', inject: true, dest: CSS_DEST },
        { src: 'ng2-material/dist/font.css', inject: true, dest: CSS_DEST }
    ],
    PROD_NPM_DEPENDENCIES: [
        { src: 'ng2-material/dist/ng2-material.css', inject: true, dest: CSS_DEST },
        { src: 'ng2-material/dist/font.css', inject: true, dest: CSS_DEST }
    ]
}
};

export const SUB_PROJECTS_FILE = SUB_PROJECTS_FILES[SUB_PROJECT_NAME];

if (ENABLE_HOT_LOADING) {
    console.log(chalk.bgRed.white.bold('The hot loader is temporary disabled.'));
    process.exit(0);
}

// Declare NPM dependencies (Note that globs should not be injected).
const NPM_DEPENDENCIES: IDependency[] = [
    { src: 'systemjs/dist/system-polyfills.src.js', inject: 'shims' },
    { src: 'reflect-metadata/Reflect.js', inject: 'shims' },
    { src: 'es6-shim/es6-shim.js', inject: 'shims' },
    { src: 'systemjs/dist/system.src.js', inject: 'shims' },
    { src: 'angular2/bundles/angular2-polyfills.js', inject: 'shims' },

    { src: join(APP_DEST, 'js/lib/jquery/jquery.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/bootstrap/bootstrap.js'), inject: 'libs', noNorm: true},

    { src: 'angular/angular.js', inject: 'libs'},
    { src: 'angular-route/angular-route.js', inject: 'libs'},
    { src: 'angular-sanitize/angular-sanitize.js', inject: 'libs'},
    { src: 'angular-resource/angular-resource.js', inject: 'libs'},
    { src: 'angular-animate/angular-animate.js', inject: 'libs'},
    { src: 'ngstorage/ngStorage.js', inject: 'libs'},

    { src: join(APP_DEST, 'js/lib/d3/d3.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/interact-1.2.4.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/keyboard.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/tween/tween.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/socket.io/socket.io.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/ui-bootstrap/ui-bootstrap-tpls-0.12.1.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/textAngular/textAngular-rangy.min.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/textAngular/textAngular-sanitize.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/textAngular/textAngular.min.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/wizard/ngWizard.js'), inject: 'libs', noNorm: true},
    { src: join(APP_DEST, 'js/lib/socket.io/angular.socket.io.js'), inject: 'libs', noNorm: true},

    { src: 'rxjs/bundles/Rx.js', inject: 'libs' },
];

const DEV_NPM_DEPENDENCIES: IDependency[] = [
    { src: 'angular2/es6/dev/src/testing/shims_for_IE.js', inject: 'shims' },
    // { src: 'angular2/bundles/angular2.dev.js', inject: 'libs' },
    // { src: 'angular2/bundles/router.dev.js', inject: 'libs' },
    // { src: 'angular2/bundles/http.dev.js', inject: 'libs' },
    { src: 'angular2/bundles/angular2.js', inject: 'libs' },
    { src: 'angular2/bundles/router.js', inject: 'libs' },
    { src: 'angular2/bundles/http.js', inject: 'libs' }
];

const PROD_NPM_DEPENDENCIES: IDependency[] = [
    { src: 'angular2/bundles/angular2.min.js', inject: 'libs' },
    { src: 'angular2/bundles/router.min.js', inject: 'libs' },
    { src: 'angular2/bundles/http.min.js', inject: 'libs' },
];

export const DEV_DEPENDENCIES = normalizeDependencies(NPM_DEPENDENCIES.
    concat(DEV_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.NPM_DEPENDENCIES,
        SUB_PROJECTS_FILE.DEV_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.APP_ASSETS)
    );

export const PROD_DEPENDENCIES = normalizeDependencies(NPM_DEPENDENCIES.
    concat(PROD_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.NPM_DEPENDENCIES,
        SUB_PROJECTS_FILE.PROD_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.APP_ASSETS)
    );

export const DEPENDENCIES = ENV === 'dev' ? DEV_DEPENDENCIES : PROD_DEPENDENCIES;
// console.log(chalk.bgWhite.blue.bold(' DEPENDENCIES: '), chalk.blue(JSON.stringify(DEPENDENCIES)));

// ----------------
// SystemsJS Configuration.
const SYSTEM_CONFIG_DEV = {
    defaultJSExtensions: true,
    paths: {
        [BOOTSTRAP_MODULE]: `${APP_BASE}${BOOTSTRAP_MODULE}`,
        'angular2/*': `${APP_BASE}angular2/*`,
        'rxjs/*': `${APP_BASE}rxjs/*`,
        '*': `${APP_BASE}node_modules/*`
    },
    packages: {
        angular2: { defaultExtension: false },
        rxjs: { defaultExtension: false }
    }
};

// TODO: Fix
// const SYSTEM_CONFIG_PROD = {
//   defaultJSExtensions: true,
//   bundles: {
//     'bundles/app': ['bootstrap']
//   }
// };

// export const SYSTEM_CONFIG = ENV === 'dev' ? SYSTEM_CONFIG_DEV : SYSTEM_CONFIG_PROD;

export const SYSTEM_CONFIG = SYSTEM_CONFIG_DEV;

// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md
export const SYSTEM_BUILDER_CONFIG = {
    defaultJSExtensions: true,
    // https://github.com/ModuleLoader/es6-module-loader/blob/master/docs/loader-config.md#paths-implementation
    paths: {
        [`${TMP_DIR}/*`]: `${TMP_DIR}/*`,
        '*': 'node_modules/*'
    }
};

// --------------
// Private.

// finds the full path for a dependency, like paths for packages from node_modules
// so we do not need to refer to them with node_modules prefixes
// NOTE: this is not true for non-js files
function normalizeDependencies(deps: IDependency[]) {
    deps
        .filter((d: IDependency) => !/\*/.test(d.src)) // Skip globs
        .forEach((d: IDependency) => {if (d.noNorm !== true) d.src = require.resolve(d.src);});
    return deps;
}

function appVersion(): number|string {
    var pkg = JSON.parse(readFileSync('package.json').toString());
    return pkg.version;
}

function customRules(): string[] {
    var lintConf = JSON.parse(readFileSync('tslint.json').toString());
    return lintConf.rulesDirectory;
}

function getEnvironment() {
    let base: string[] = argv['_'];
    let prodKeyword = !!base.filter(o => o.indexOf(ENVIRONMENTS.PRODUCTION) >= 0).pop();
    if (base && prodKeyword || argv['env'] === ENVIRONMENTS.PRODUCTION) {
        return ENVIRONMENTS.PRODUCTION;
    } else {
        return ENVIRONMENTS.DEVELOPMENT;
    }
}
