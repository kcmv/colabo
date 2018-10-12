# Intro

Provides config support for the Colabo.Space Ecosystem

This is isomorphic puzzle and can be used both in backend and frontend system

# How to use the puzzle

There are two phases of initialization of config:

1. INIT-1: load config data
2. INIT-2: init config puzzle with config data

They are separate because in some systems they should happen at separate places, at separate time

## Backend

### Init

Config file:

The best practice is to put it at `<backend_app_folder>/config/global.js`.

**NOTE**: it is important that this file is ***not imported***, but ***required*** and that it is therefore JS (not TS, although it can be, if we still do not import it) because otherwise it would be ***bundled*** in a final file during building and we ***wouldn't be able to change the config*** after building project

The basic of the config file is:

```js
'use strict';

// this is file is available to the rest of the system
// through the puzzle `@colabo-utils/i-config`
// please read `@colabo-utils/i-config/README.md` for more details

// NOTE: it is important that this file is not imported, but required
// and that it is therefore JS (not TS, although it can be, if we still do not import it)
// because otherwise it would be bundled in a final file during building
// and we wouldn't be able to change the config after building project

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
let config = require('@colabo-utils/i-config');
config.init(configFile);
```

### Access the config data

Now you can access the config data at any part of the code as simply as (the example is from the backend puzzle: `@colabo-topiChat/b-talk`):

```ts
const MODULE_NAME:string = "@colabo-topiChat/b-talk";

import {GetPuzzle} from '@colabo-utils/i-config';
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

### Init

Therefore, we need to setup INIT-1 phase through manual injection of config file (usually: `<frontend_app_folder>/src/config/global.js`). So far we are doing it by injecting it in the `index.html` file:

```html
<head>
    <script src="config/global.js"></script>
</head>

```

The phase INIT-2 happens at the beginning of the `polyfills.ts` file:

```ts
console.log("polyfills.ts");

// let configFile = require('./config/global');
// import * as configFile from './config/global';
let globalSet = (<any>window).globalSet;
console.log("[polyfills.ts] globalSet.puzzles: %s", JSON.stringify(globalSet.puzzles));
// let config = require('@colabo-utils/i-config');
import * as config from '@colabo-utils/i-config';
config.init(globalSet);
```

### Access the config data

Now you can access the config data at any part of the code as simply as (the example is from the frontend puzzle: `@colabo-rima/rima_aaa`, file `rima-aaa.service.ts`):

```ts
import * as config from '@colabo-utils/i-config';

console.log("[rima-aaa.service] config.GetGeneral('mapId'):", config.GetGeneral('mapId'));
```

