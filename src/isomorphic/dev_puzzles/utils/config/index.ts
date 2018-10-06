const MODULE_NAME:string = "@colabo-utils/config";

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
let globalSet:any;

export function init(_globalSet:any):any{
    globalSet = _globalSet;

    console.log("[%s] globalSet.general: %s", MODULE_NAME, JSON.stringify(globalSet.general));

    Puzzles = globalSet.puzzles;
    General = globalSet.general;
}

export function GetProperty(propertyName):any{
    console.log("[%s:GetProperty] propertyName: %s", MODULE_NAME, propertyName);
    return globalSet[propertyName];
}

export function GetPuzzle(puzzleName):any{
    console.log("[%s:GetPuzzle] puzzleName: %s", MODULE_NAME, puzzleName);
    return Puzzles[puzzleName];
}

export function GetGeneral(propertyName):any{
    console.log("[%s:GetGeneral] propertyName: %s", MODULE_NAME, propertyName);
    return General[propertyName];
}