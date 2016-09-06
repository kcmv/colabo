(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var puzzles = {
  name: 'presentation',
  COMPASS: {
    PATHS: {
      '.': {
        destDir: '.',
        cssDir: 'css'
      }
    }
  },

  puzzlesBuild: {
    presentation: {
      path: '.',
      css: true,
      injectJs: ['js/services.js',
        'lib/reveal.js/lib/js/head.min.js',
        'lib/reveal.js/js/reveal.js',
        'lib/reveal.js/plugin/highlight/highlight.js',
        'lib/reveal.js/plugin/notes/notes.js',
        'lib/reveal.js/plugin/markdown/markdown.js',
        'lib/reveal.js/plugin/markdown/marked.js'
      ],
      injectCss: ['css/presentation.css',
        'lib/reveal.js/css/reveal.css',
        'lib/reveal.js/css/theme/black.css',
        // 'lib/reveal.js/css/theme/moon.css',
        // Theme used for syntax highlighting of code
        'lib/reveal.js/lib/css/zenburn.css',
        'lib/reveal.js/css/print/paper.css',
        // 'lib/reveal.js/css/print/pdf.css'
      ]
    }
  },

  puzzlesActions: {
    presentation: {
      'cf.puzzles.presentation.createPresentation': {

      }
    }
  },

  puzzles: {
    presentation: {
      active: true,
      services: { // list of services that are available in this puzzle
        CfPuzzlesPresentationServices: { // service name
          isTS: true, // is written in TS
          isNG2: true, // is written as NG2
          isAvailableInNG1: true, // should it be available in NG1 world?
          isGlobal: true, // should we add it at the top level as addProvider in app2
          module: 'presentationServices', // NG1 module the service is inserted in
          path: 'cf.puzzles.presentation.service' // unique id/path that is addressing the service
        }
      },
      plugins: { // list of plugins that are available in this puzzle
        mapVisualizePlugins: ['CfPuzzlesPresentationServices']
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
	global.Config.Plugins = puzzles;
}

// node.js world
if(typeof module !== 'undefined'){
	module.exports = puzzles;
}

}()); // end of 'use strict';
