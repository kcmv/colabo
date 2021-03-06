(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var puzzles = {
  name: 'coevoludens',
  COMPASS: {
    PATHS: {
      '.': {
        destDir: '.',
        cssDir: 'css'
      }
    }
  },

  puzzlesBuild: {
    coevoludens: {
      path: '.',
      css: true,
      injectJs: ['js/services.js'
      ],
      injectCss: ['css/coevoludens.css'
      ]
    }
  },

  puzzlesActions: {
    coevoludens: {
      'cf.puzzles.coevoludens.createCoevoludens': {

      }
    }
  },

  puzzles: {
    coevoludens: {
      active: true,
      services: { // list of services that are available in this puzzle
        CfPuzzlesCoevoludensServices: { // service name
          isTS: true, // is written in TS
          isNG2: true, // is written as NG2
          isAvailableInNG1: true, // should it be available in NG1 world?
          isGlobal: true, // should we add it at the top level as addProvider in app2
          module: 'coevoludensServices', // NG1 module the service is inserted in
          path: 'cf.puzzles.coevoludens.service' // unique id/path that is addressing the service
        }
      },
      plugins: { // list of plugins that are available in this puzzle
        mapVisualizePlugins: ['CfPuzzlesCoevoludensServices']
      }
    }
  }
}

if(typeof window !== 'undefined'){
	if(typeof window.Config === 'undefined') window.Config = {};
  if(typeof window.Config.Plugins === 'undefined') window.Config.Plugins = {};
  if(typeof window.Config.Plugins.external === 'undefined') window.Config.Plugins.external = {};
	window.Config.Plugins.external[puzzles.name] = puzzles;
}

if(typeof angular !== 'undefined'){
	angular.module('Config')
		.constant("Plugins", puzzles);
}

if(typeof global !== 'undefined'){
	if(typeof global.Config === 'undefined') global.Config = {};
  if(typeof global.Config.Plugins === 'undefined') global.Config.Plugins = {};
  if(typeof global.Config.Plugins.external === 'undefined') global.Config.Plugins.external = {};
  global.Config.Plugins.external[puzzles.name] = puzzles;
}

// node.js world
if(typeof module !== 'undefined'){
	module.exports = puzzles;
}

}()); // end of 'use strict';
