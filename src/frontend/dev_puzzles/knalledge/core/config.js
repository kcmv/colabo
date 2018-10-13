(function () { // This prevents problems when concatenating scripts that aren"t strict.
"use strict";

var puzzles = {
  name: "knalledge.knalledge_core",
  COMPASS: {
    PATHS: {
      // ".": {
      //   destDir: ".",
      //   cssDir: "css"
      // }
    }
  },

  puzzlesBuild: {
    "knalledge.knalledge_core": {
      path: ".",
      css: true,
      injectJs: [
        "lib/debug.js",
        "lib/debugpp/index.js",

        "code/knalledge/index.js",
        // migrated into TypeScript
        // "code/knalledge/kNode.js",
        // "code/knalledge/kEdge.js",
        "code/knalledge/kMap.js",
        "code/knalledge/vkNode.js",
        "code/knalledge/vkEdge.js",
        // TODO: Not sure where it fits (probable not here in the core) ...
        "code/knalledge/state.js",
      ],
      injectCss: ""
    }
  },

  puzzles: {
    "knalledge.knalledge_core": {
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
