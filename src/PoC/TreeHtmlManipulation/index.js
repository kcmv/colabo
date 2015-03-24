(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/*
cd TreeHTML
../../frontend/scripts/web-server.js 8080 ../../Poc/TreeHtmlManipulation/
*/

var dimensions = {
	margin: {top: 20, right: 120, bottom: 20, left: 120},
	sizes: {
		widthFull: 960,
		heightFull: 700,
		width: null,
		height: null,
	},
	node: {
		width: 150
	}
};

var config = {
	nodes: {
		punctual: false,
		svg: {
			show: false
		},
		html: {
			show: true
		}
	},
	edges: {
		show: true,
		labels: {
			show: true
		}
	},
	transitions: {
		enter: {
			duration: 1000,
			// if set to true, entering elements will enter from the node that is expanding
			// (no matter if it is parent or grandparent, ...)
			// otherwise it elements will enter from the parent node
			referToToggling: true,
			animate: {
				position: true,
				opacity: true
			}
		},
		update: {
			duration: 500,
			referToToggling: true,
			animate: {
				position: true,
				opacity: true
			}
		},
		exit: {
			duration: 750,
			// if set to true, exiting elements will exit to the node that is collapsing
			// (no matter if it is parent or grandparent, ...)
			// otherwise it elements will exit to the parent node
			referToToggling: true,
			animate: {
				position: true,
				opacity: true
			}
		}
	}
};

dimensions.sizes.width = dimensions.sizes.widthFull
	- dimensions.margin.right - dimensions.margin.left;
dimensions.sizes.height = dimensions.sizes.heightFull
	- dimensions.margin.top - dimensions.margin.bottom;

var treeHtml = new TreeHtml(d3.select("body"), config, dimensions);
treeHtml.init();
treeHtml.load("treeData.json");

}()); // end of 'use strict';