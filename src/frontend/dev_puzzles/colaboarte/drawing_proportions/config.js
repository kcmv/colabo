(function () { // This prevents problems when concatenating scripts that aren"t strict.
"use strict";

var puzzles = {
  name: "colaboarte.drawing_proportions",
  COMPASS: {
    PATHS: {
      ".": {
        destDir: ".",
        cssDir: "css"
      }
    }
  },

  puzzlesBuild: {
    "colaboarte.drawing_proportions": {
      path: ".",
      css: true,
      injectJs: [
        "node_modules/d3/d3.js",

        "code/knalledge/mapLayout.js", "code/knalledge/mapLayoutTree.js", "code/knalledge/mapLayoutFlat.js", "code/knalledge/mapLayoutGraph.js", "code/knalledge/mapVisualization.js", "code/knalledge/mapVisualizationTree.js", "code/knalledge/mapVisualizationFlat.js", "code/knalledge/mapVisualizationGraph.js", "code/knalledge/mapManager.js", "code/knalledge/mapStructure.js",
      ],
      injectCss: ["css/default.css", "css/graph.css"]
    }
  },

  puzzles: {
    "colaboarte.drawing_proportions": {
      active: true
    }
  }
}

// Part responsible for injecting and making available the config inside of different JS environments and frameworks

if(typeof window !== "undefined"){
	if(typeof window.Config === "undefined") window.Config = {};
  if(typeof window.Config.Plugins === "undefined") window.Config.Plugins = {};
  if(typeof window.Config.Plugins.external === "undefined") window.Config.Plugins.external = {};
	window.Config.Plugins.external[puzzles.name] = puzzles;
}

if(typeof angular !== "undefined"){
	angular.module("Config")
		.constant("Plugins", puzzles);
}

if(typeof global !== "undefined"){
	if(typeof global.Config === "undefined") global.Config = {};
  if(typeof global.Config.Plugins === "undefined") global.Config.Plugins = {};
  if(typeof global.Config.Plugins.external === "undefined") global.Config.Plugins.external = {};
  global.Config.Plugins.external[puzzles.name] = puzzles;
}

// node.js world
if(typeof module !== "undefined"){
	module.exports = puzzles;
}

}()); // end of "use strict";
