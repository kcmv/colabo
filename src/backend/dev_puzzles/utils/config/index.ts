// this is relative to inside the `dist` folder
// not to this (`index.ts`) file
// the file we are looking for here is `config/global.js`
// the `config` folder is sibling to the `dev_puzzles` folder

// NOTE: it is important that this file is not imported, but required
// and that it is therefore JS (not TS, although it can be if we still do not import it)
// because otherwise it would be bundled in a final file during building
// and we wouldn't be able to change config after building project

let Global = require('../../../../config/global');
console.log("[config] Global:", Global);
console.log("[config] Global.paths:", Global.paths);
console.log("[config] Global.dbConfig:", Global.dbConfig);
let Paths = Global.paths;
let DbConfig = Global.dbConfig;
let Puzzles = Global.puzzles;
console.log("[config] Global:", Global);

export function GetForPuzzle(puzzleName):any{
    return Puzzles[puzzleName];
}

export {Global, Paths, DbConfig};