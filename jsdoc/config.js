{
	"opts": {
		"template": "../src/backend/node_modules/ink-docstrap/template",  // same as -t templates/default
		"encoding": "utf8",               // same as -e utf8
		"destination": "../doc",          // same as -d ./out/
		"recurse": true                  // same as -r
		// "tutorials": "path/to/tutorials", // same as -u path/to/tutorials
	},
	"plugins": ["plugins/markdown"],
	"markdown": {
		"tags": ["params", "returns", "var", "vars", "type", "types"]
	},
	"templates": {
		"monospaceLinks": true,
		"systemName" : "KnAllEdge (generic knownledge pool)",
		"footer": "This work is part of supporting collaborative knowledge building",
		"copyright" :  "The MIT License (MIT)<br/>\nCopyright (c) 2015-2016 Sasha Mile Rudan & Sinisha Rudan",
		"includeDate"           : "false",
		"navType"   : "inline",
		"theme"     : "cerulean",
		"linenums"  : "true",
		"collapseSymbols"       : "false",
		"inverseNav": "true",
		"outputSourceFiles"     : "true" ,
		"outputSourcePath"      : "true",
		"dateFormat": "dddd, MMMM Do YYYY", // http://momentjs.com/docs/#/displaying/format/
		"syntaxTheme"           : "default", // https://github.com/tmont/sunlight/tree/master/src/themes
		"sort"      : "true"
	},
	"source": {
		"include": [
			"../README.md",
			"../src/frontend/app",
			"../src/frontend/dist/tmp" // precompiled TypeScript
		],
		"exclude": [
			"../src/frontend/app/js/lib",
			"../src/frontend/node_modules"
		],
		"includePattern": ".+\\.js(doc)?$",
		"excludePattern": "(^|\\/|\\\\)_"
	}
}
