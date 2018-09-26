// this is relative to inside the `dist` folder
// not to this (`index.ts`) file
// the file we are looking for here is `config/global.js`
// the `config` folder is sibling to the `dev_puzzles` folder

// NOTE: it is important that this file is not imported, but required
// and that it is therefore JS (not TS, although it can be if we still do not import it)
// because otherwise it would be bundled in a final file during building
// and we wouldn't be able to change config after building project

let Puzzles:any;
let General:any;
let configFile:any;

export function init(_configFile:any):any{
    configFile = _configFile;
    console.log("[config-init] configFile.general:", configFile.general);

    Puzzles = configFile.puzzles;
    General = configFile.general;
}

export function GetProperty(property):any{
    return configFile[property];
}

export function GetPuzzle(puzzleName):any{
    return Puzzles[puzzleName];
}

export function GetGeneral(property):any{
    return General[property];
}

// export {Paths};