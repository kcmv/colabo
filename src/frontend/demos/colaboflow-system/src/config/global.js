'use strict';

// this is file is available to the rest of the system
// through the puzzle `@colabo-utils/i-config`
// please read `@colabo-utils/i-config/README.md` for more details

// NOTE: it is important that this file is not imported, but required
// and that it is therefore JS (not TS, although it can be, if we still do not import it)
// because otherwise it would be bundled in a final file during building
// and we wouldn't be able to change the config after building project

console.log("[config/global.js] Setting up the globalSet variable");

let globalSet = {};
if (typeof window !== 'undefined' && typeof window !== 'null'){
	if(!window.hasOwnProperty('globalSet')) window.globalSet = {};
	globalSet = window.globalSet;
}
if (typeof global !== 'undefined' && typeof global !== 'null'){
	if(!global.hasOwnProperty('globalSet')) global.globalSet = {};
	globalSet = global.globalSet;
}

console.log("[config/global.js] Populating the globalSet variable");

if (!globalSet.hasOwnProperty('general')) {
	console.log("[config/global.js] Setting up globalSet.general");
	globalSet.general = {
		// RESTfull backend API url
		serverUrl: 'http://127.0.0.1:8001',
		// serverUrl: 'https://fv.colabo.space/api', // colabo-space-1 (https)
		// serverUrl: 'http://api.colabo.space',
		// serverUrl: 'http://158.39.75.120:8001', // colabo-space-1 (old)

		// active map
		mapId: '5b96619b86f3cc8057216a03',
		userNodeId: '5b4a16e800ea79029ca0c395',
		/** multiple players can play on the same opening card */
		OPENNING_CARD_MULTIPLE_ANSWERS: true,

		/** multiple players can play on a card played by another player */
		PLAYER_CARD_MULTIPLE_ANSWERS: true,

		/** multiple players can play on a card played by another player */
		REPLAY_PLAYED_CARD: false
	};
}

if (!globalSet.hasOwnProperty('puzzles')) {
	console.log("[config/global.js] Setting up globalSet.puzzles");
	globalSet.puzzles = {
		'@colabo-topichat/f-core': {
			// socketUrl: 'http://localhost/',
			socketUrl: 'http://localhost:8001/',
			// socketUrl: 'https://fv.colabo.space/api',
		}
	};
}

console.log("[config/global.js] globalSet.puzzles:", globalSet.puzzles);

// node support (export)
if (typeof module !== 'undefined'){
  // workarround for TypeScript's `module.exports` readonly
  if('exports' in module){
    if (typeof module['exports'] !== 'undefined'){
      module['exports'].globalSet = globalSet;
    }
  }else{
    module['exports'] = globalSet;
  }
}

console.log("[config/global.js] finished");
