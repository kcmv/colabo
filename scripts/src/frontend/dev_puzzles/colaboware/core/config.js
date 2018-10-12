(function () { // This prevents problems when concatenating scripts that aren"t strict.
"use strict";

var puzzles = {
  name: "colaboware.colaboware_core",
  COMPASS: {
    PATHS: {
      // ".": {
      //   destDir: ".",
      //   cssDir: "css"
      // }
    }
  },

  puzzlesBuild: {
    "colaboware.colaboware_core": {
      path: ".",
      css: true,
      injectJs: [
      ],
      injectCss: ""
    }
  },

  puzzles: {
    "colaboware.colaboware_core": {
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
