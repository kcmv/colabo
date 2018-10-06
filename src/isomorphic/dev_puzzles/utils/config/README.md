# Intro

Provides config support for the Colabo.Space Ecosystem

This is isomorphic puzzle and can be used both in backend and frontend system

# Usage

There are two phases of initialization of config:

1. INIT-1: load config data
2. INIT-2: init config puzzle with config data

They are separate because in some systems they should happen at separate places, at separate time

## Backend

Config file:

The best practice is to put it at `<backend_app_folder>/config/global.js`

The basic content is:

```js
'use strict';

// this is file is imported and exported 
// to the rest of the system through the puzzle
// `@colabo-utils/config`

if (!global.hasOwnProperty('general')) {
	console.log("[config/global.js] Setting up global.general");
	global.general = {
		// active map
		// mapId: '5b96619b86f3cc8057216a03',
	};
}

if (!global.hasOwnProperty('puzzles')) {
	console.log("Setting up global.puzzles");
	global.puzzles = {
		// '@colabo-topiChat/b-talk': {
		// 	    saveTalkToMap: true,
		// 	    mapId: "5b96619b86f3cc8057216a03",
		// 	    iAmId: "1b96619b86f3cc8057216a05",
		// 	    nodeId: ""
		// }
	};
}

module.exports = global;
```

Initialization:

The best practice is to initialize it (both INIT-1 and INIT-2) from the main backend file: `<backend_app_folder>/index.ts`:

```ts
// INIT-1
let configFile = require('./config/global');
console.log("[Colabo.Space:index] configFile.paths: %s", JSON.stringify(configFile.paths));

// INIT-2
let config = require('@colabo-utils/config');
config.init(configFile);
```

Usage (example):

```ts
const MODULE_NAME:string = "@colabo-topiChat/b-talk";

import {GetPuzzle} from '@colabo-utils/config';
let puzzleConfig:any = GetPuzzle(MODULE_NAME);

console.log("[TopiChatTalk] mapId = ", puzzleConfig.mapId);
```

## Frontend

In the frontend there is still problem with the `INIT-1` phase. We cannot put it early enough to be sure that any later use of it will have it ready.

NOTE: the reason is that we want to provide it available on angular components declaration-time, not only at initialization/use time.

For example:

1. a file that has a service component is imported (declaration-time) at early phase, and 
2. later service is instantiated and 
3. even later it is used

Solutions that exist with pre-booting are working fine for cases 2 and 3, but not for 1

Therefore, we need to setup INIT-1 phase through manual injection of config file (usually: `<frontend_app_folder>/src/config/global.js`)