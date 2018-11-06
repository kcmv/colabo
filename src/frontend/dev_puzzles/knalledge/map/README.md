# Intro

`@colabo-knalledge/f-map` is a ***f-colabo.space*** puzzle.

Visualizes KnAllEdge through a map.

-----

This puzzle is automatically created with the [colabo tools](https://www.npmjs.com/package/@colabo/cli)

# Added on global level

## config.plugins.js

It requires `config.plugins.js` at 
`<app_project>/src/app/config/config.plugins.js`, where the `<app_project>` is the folder that contains `angular.json` file of your application.

## angular.json

```json

"styles": [
    "node_modules/@colabo-knalledge/f-view_enginee/css/default.css",
    "node_modules/@colabo-knalledge/f-view_enginee/css/graph.css"
],
"scripts": [
    "src/app/config/config.plugins.js",

    "node_modules/@colabo-knalledge/f-core/lib/debug.js",
    "node_modules/@colabo-knalledge/f-core/lib/debugpp/index.js",
    "node_modules/@colabo-knalledge/f-core/code/knalledge/js-original/index.js",
    "node_modules/@colabo-knalledge/f-core/code/knalledge/js-original/kNode.js",
    "node_modules/@colabo-knalledge/f-core/code/knalledge/js-original/kEdge.js",
    "node_modules/@colabo-knalledge/f-core/code/knalledge/js-original/vkNode.js",
    "node_modules/@colabo-knalledge/f-core/code/knalledge/js-original/vkEdge.js",
    "node_modules/@colabo-knalledge/f-core/code/knalledge/js-original/state.js",
    "node_modules/@colabo-knalledge/f-view_enginee/node_modules/d3/d3.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapLayout.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapLayoutTree.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapLayoutFlat.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapLayoutGraph.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapVisualization.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapVisualizationTree.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapVisualizationFlat.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapVisualizationGraph.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapManager.js",
    "node_modules/@colabo-knalledge/f-view_enginee/code/knalledge/mapStructure.js",
    "node_modules/@colabo-knalledge/f-view_interaction/lib/keyboard.js",
    "node_modules/@colabo-knalledge/f-view_interaction/lib/interact.js",
    "node_modules/@colabo-knalledge/f-view_interaction/code/interaction/interaction.js",
    "node_modules/@colabo-knalledge/f-view_interaction/code/interaction/moveAndDrag.js",
    "node_modules/@colabo-knalledge/f-view_interaction/code/interaction/keyboard.js"
]
```