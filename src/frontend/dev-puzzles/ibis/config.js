(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var puzzles = {
  COMPASS: {
    PATHS: {
      '.': {
        destDir: '.',
        cssDir: 'css'
      }
    }
  },

  puzzlesBuild: {
    ibis: {
      path: '.',
      css: true,
      injectJs: '',
      injectCss: 'css/default.css'
    }
  },

  puzzlesConfig: {
    ibis: {
      available: true
    }
  },

  puzzles: {
    active: true,
    services: {
      CfPuzzlesIbisService: {
      }
    },
    plugins: {
      mapVisualizePlugins: ['CfPuzzlesIbisService']
    }
  }
}

// node.js world
if(typeof module !== 'undefined'){
	module.exports = puzzles;
}

}()); // end of 'use strict';
