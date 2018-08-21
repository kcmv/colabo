// good example for describing interfaces: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/fd7bea617cc47ffd252bf90a477fcf6a6b6c3ba5/types/node/index.d.ts#L438

// TODO: not working
// import * as chalk from 'chalk';
var chalk = require('chalk');
import * as fs from 'fs';

export interface PuzzlesOfferDescription {
    npm: string,
    path: string
}

export interface PuzzlesDescription {
    name: string,
    description: string,
    dependencies: {
        [key: string]: any
    },
    offers: {
        [key: string]: PuzzlesOfferDescription
    }
}

var ChildProcess = require("child_process");

export class ColaboConfigParser{
    private colaboConfig: any;
    private colaboConfigFolder: string;
    private puzzlesDescription: PuzzlesDescription;
    constructor(private fileName:string){

    }

    parse(){
        var configFileFullUnresolved;
        var configFileFull;
        try {
            configFileFullUnresolved = process.cwd() + "/" + this.fileName
            configFileFull = fs.realpathSync(configFileFullUnresolved);
        } catch (e) {
            console.error("Problem with resolving the config file `%s` -> `%s`", this.fileName, configFileFullUnresolved);
            console.error("Error: ", e);
            process.exit(2);
        }

        try{
           this.colaboConfig = require(configFileFull);
        }catch(e){
            console.error("Problem with importing the config file: ", configFileFull);
            console.error("Error: ", e);
            process.exit(2);
        }
        this.colaboConfigFolder = "./";
        if (this.fileName.lastIndexOf("/") >= 0) {
            this.colaboConfigFolder = this.fileName.substring(0, this.fileName.lastIndexOf("/") + 1);
        }
        this.puzzlesDescription = this.colaboConfig.puzzles;
        console.log("Config file '%s' is loaded and parsed", this.fileName);
    }

    info(){
        console.log("Config file '%s' info", this.fileName);
        console.log("\tname: ", this.puzzlesDescription.name);
        console.log("\tdescription: ", this.puzzlesDescription.description);
    }

    listOffers(){
        console.log("Puzzle offers in the file '%s':", this.fileName);
        for (let id in this.colaboConfig.puzzles.offers){
            let puzzleOffer: PuzzlesOfferDescription = this.colaboConfig.puzzles.offers[id];
            console.log("\tnpm: %s", puzzleOffer.npm); 
        }
    }

    listDependencies() {
        console.log("Puzzle dependencies in the file '%s':", this.fileName);
        for (let puzzleDependencyName in this.colaboConfig.puzzles.dependencies) {
            console.log("\t%s", puzzleDependencyName);
        }
    }

    isNpmWarning(msg:string):boolean{
        if (msg.indexOf("ERR!") >= 0) return false;
        if(msg.indexOf("WARN!") >= 0) return true;
        if (msg.indexOf("ERR") >= 0) return false;
        if(msg.indexOf("WARN") >= 0) return true;
        msg = msg.toUpperCase();
        if (msg.indexOf("ERROR") >= 0) return false;
        if(msg.indexOf("WARNING") >= 0) return true;
        return false;
    }

    async offerPuzzle(puzzleOffer: PuzzlesOfferDescription): Promise<any>{
        console.log("Offering puzzle: %s", puzzleOffer.npm);

        var linkPath: string = this.colaboConfigFolder + puzzleOffer.path;
        console.log("\tlinkPath: %s", linkPath);
        return new Promise((resolve, reject) => {
            ChildProcess.exec("npm link", { cwd: linkPath }, function(error, stdout, stderr) {
                if (error) {
                    if(this.isNpmWarning(error)){
                        console.warn("\t[%s] WARNING: ", puzzleOffer.npm, error);
                        resolve(error);
                    }else{
                        console.error("\t[%s] ERROR: ", puzzleOffer.npm, error);
                        reject(error);
                    }
                }
                if (stderr) {
                    if (this.isNpmWarning(stderr)){
                        console.warn("\t[%s] STD-WARNING: ", puzzleOffer.npm, stderr);
                        resolve(stderr);
                    }else{
                        console.error("\t[%s] STD-ERROR: ", puzzleOffer.npm, stderr);
                        reject(stderr);
                    }
                }
                if (stdout) {
                    console.log("\t[%s] stdout: ", puzzleOffer.npm, stdout);
                    resolve(stdout);
                }
            }.bind(this));
        });
    }

    async offerPuzzles(): Promise<any>{
        console.log("Offering puzzles (`npm link`-ing them to the local machine) from the file '%s':", this.fileName);
        for (let id in this.colaboConfig.puzzles.offers) {
            let puzzleOffer: PuzzlesOfferDescription = this.colaboConfig.puzzles.offers[id];

            await this.offerPuzzle(puzzleOffer);
        }

        return Promise.resolve("OK");
    }

    async installPuzzle(puzzleDependencyName: string): Promise<any> {
        console.log();
        console.log("Installing: %s", puzzleDependencyName);
        return new Promise((resolve, reject) => {
            ChildProcess.exec("npm link " + puzzleDependencyName, { cwd: this.colaboConfigFolder }, function(error, stdout, stderr) {
                if (error){
                    if (this.isNpmWarning(error)) {
                        console.warn("\t[%s] WARNING: ", puzzleDependencyName, error);
                        resolve(error);
                    } else {
                        console.error("\t[%s] ERROR: ", puzzleDependencyName, error);
                        reject(error);
                    }
                }
                if (stderr) {
                    if (this.isNpmWarning(stderr)) {
                        console.warn("\t[%s] STD-WARNING: ", puzzleDependencyName, stderr);
                        resolve(stderr);
                    } else {
                        console.error("\t[%s] STD-ERROR: ", puzzleDependencyName, stderr);
                        reject(stderr);
                    }
                }
                if (stdout){
                    console.log("\t[%s] stdout: ", puzzleDependencyName, stdout);
                    resolve(stdout);
                }
            }.bind(this));
        });
    }

    async installPuzzles(): Promise<any> {
        console.log("\tcolaboConfigFolder: %s", this.colaboConfigFolder);

        console.log("Installing puzzle dependencies (`npm link <puzzle-package-name>`-ing them to the local project) from the file '%s':", this.fileName);
        for (let puzzleDependencyName in this.colaboConfig.puzzles.dependencies) {
            await this.installPuzzle(puzzleDependencyName);
        }

        return Promise.resolve("OK");
    }
}