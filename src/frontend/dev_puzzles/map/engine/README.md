# Intro

`@colabo-map/f-engine` is a ***f-colabo.space*** puzzle.

Main engine of the Colabo Map visualizing the KnAllEdge space.

# Layout

1. `fxFlexFill` in the `#map-parent` is necessary to let the `#map-container` to take all available place when it needs less
2. for we should have `overflow-y: hidden;` to avoid overflowing and extra scrolling

# Web-workers

+ in `tsconfig.json` under `compilerOptions.lib` add `webworker`

-----

This puzzle is automatically created with the [colabo tools](https://www.npmjs.com/package/@colabo/cli)