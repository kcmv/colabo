const MODULE_NAME:string = "@colabo-utils/i-config";

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