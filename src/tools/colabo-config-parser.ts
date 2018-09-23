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

export interface SymLinkInfo {
    from: string,
    to: string
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
        msg = "" + msg;
        if(!msg || typeof msg !== 'string') return false;

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
            let offerCmd = "npm link";
            if(this.colaboConfig.sudo && this.colaboConfig.sudo.offer){
                offerCmd = "sudo " + offerCmd;
            }
            console.log("\t offer command: %s", offerCmd);
            ChildProcess.exec(offerCmd, { cwd: linkPath }, function(error, stdout, stderr) {
                if (error) {
                    if(this.isNpmWarning(error)){
                        console.warn(chalk.blue.bold("\t[%s] WARNING: "), puzzleOffer.npm, error);
                        resolve(error);
                    }else{
                        console.error(chalk.red.bold("\t[%s] ERROR: "), puzzleOffer.npm, error);
                        reject(error);
                    }
                }else if (stderr) {
                    if (this.isNpmWarning(stderr)){
                        console.warn(chalk.blue.bold("\t[%s] STD-WARNING: "), puzzleOffer.npm, stderr);
                        resolve(stderr);
                    }else{
                        console.error(chalk.red.bold("\t[%s] STD-ERROR: "), puzzleOffer.npm, stderr);
                        reject(stderr);
                    }
                }else if (stdout) {
                    console.log("\t[%s] stdout: ", puzzleOffer.npm, stdout);
                    resolve(stdout);
                }else{
                    resolve("OK");
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
            let installCmd = "npm link " + puzzleDependencyName;
            if(this.colaboConfig.sudo && this.colaboConfig.sudo.install){
                installCmd = "sudo " + installCmd;
            }
            console.log("\t install command: %s", installCmd);
            ChildProcess.exec(installCmd, { cwd: this.colaboConfigFolder }, function(error, stdout, stderr) {
                if (error){
                    if (this.isNpmWarning(error)) {
                        console.warn(chalk.blue.bold("\t[%s] WARNING: "), puzzleDependencyName, error);
                        resolve(error);
                    } else {
                        console.error(chalk.red.bold("\t[%s] ERROR: "), puzzleDependencyName, error);
                        reject(error);
                    }
                }else if (stderr) {
                    if (this.isNpmWarning(stderr)) {
                        console.warn(chalk.blue.bold("\t[%s] STD-WARNING: "), puzzleDependencyName, stderr);
                        resolve(stderr);
                    } else {
                        console.error(chalk.red.bold("\t[%s] STD-ERROR: "), puzzleDependencyName, stderr);
                        reject(stderr);
                    }
                }else if (stdout){
                    console.log("\t[%s] stdout: ", puzzleDependencyName, stdout);
                    resolve(stdout);
                }else{
                    resolve("OK");
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

    async symlink(symLinkInfo: SymLinkInfo): Promise<any> {
        console.log();
        // if relative link rewrite from with "../" for the same number 
        // of the folder depoth of the symLinkInfo.to
        console.log("Symlinking: from: %s, to: %s", symLinkInfo.from, symLinkInfo.to);

        // both are relative
        if(symLinkInfo.from[0] !== "/" && symLinkInfo.to[0] !== "/"){
            let depth = (symLinkInfo.to.split("/").length - 1);
            for(let i=0; i<depth; i++){ symLinkInfo.from = "../"+symLinkInfo.from}
        }
        // destination (to) is relative
        if(symLinkInfo.to[0] === "/"){
            let fromUnresolved = this.colaboConfigFolder + "/" + symLinkInfo.from;
            symLinkInfo.from = fs.realpathSync(fromUnresolved);

        }
        let cmdStr;
        if(this.colaboConfig.sudo && this.colaboConfig.sudo.symlinks){
            cmdStr = "sudo rm -f " + symLinkInfo.to + "; sudo ln -s " + symLinkInfo.from + " " + symLinkInfo.to;
        }else{
            cmdStr = "rm -f " + symLinkInfo.to + "; ln -s " + symLinkInfo.from + " " + symLinkInfo.to;
        }
        console.log("\t symlinking command: %s", cmdStr);
        return new Promise((resolve, reject) => {
            ChildProcess.exec(cmdStr, { cwd: this.colaboConfigFolder }, function(error, stdout, stderr) {
                if (error){
                    if (this.isNpmWarning(error.toString())) {
                        console.warn(chalk.blue.bold("\t[%s] WARNING: "), symLinkInfo.from, error);
                        resolve(error);
                    } else {
                        console.error(chalk.red.bold("\t[%s] ERROR: "), symLinkInfo.from, error);
                        reject(error);
                    }
                }else if (stderr) {
                    if (this.isNpmWarning(stderr.toString())) {
                        console.warn(chalk.blue.bold("\t[%s] STD-WARNING: "), symLinkInfo.from, stderr);
                        resolve(stderr);
                    } else {
                        console.error(chalk.red.bold("\t[%s] STD-ERROR: "), symLinkInfo.from, stderr);
                        reject(stderr);
                    }
                }else if (stdout){
                    console.log("\t[%s] stdout: ", symLinkInfo.from, stdout);
                    resolve(stdout);
                }else{
                    resolve("OK");
                }
            }.bind(this));
        });
    }

    async symlinks(): Promise<any> {
        console.log("\tcolaboConfigFolder: %s", this.colaboConfigFolder);

        console.log("Symlinking (`ln -s <from> <to>`)");
        for (let id in this.colaboConfig.symlinks) {
            let symLinkInfo: SymLinkInfo = this.colaboConfig.symlinks[id];
            await this.symlink(symLinkInfo);
        }

        return Promise.resolve("OK");
    }

    async buildPuzzle(puzzleOffer: PuzzlesOfferDescription): Promise<any>{
        console.log("Building puzzle: %s", puzzleOffer.npm);

        var buildPath: string = this.colaboConfigFolder + puzzleOffer.path;
        console.log("\tbuildPath: %s", buildPath);
        return new Promise((resolve, reject) => {
            let buildCmd = "npm run build";
            if(this.colaboConfig.sudo && this.colaboConfig.sudo.build){
                buildCmd = "sudo " + buildCmd;
            }
            // let buildCmd = "tsc";
            console.log("\t build command: %s", buildCmd);
            ChildProcess.exec(buildCmd, { cwd: buildPath }, function(error, stdout, stderr) {
                if (error) {
                    if(this.isNpmWarning(error)){
                        console.warn(chalk.blue.bold("\t[%s] WARNING: "), puzzleOffer.npm, error);
                        resolve(error);
                    }else{
                        console.error(chalk.red.bold("\t[%s] ERROR: "), puzzleOffer.npm, error);
                        reject(error);
                    }
                }else if (stderr) {
                    if (this.isNpmWarning(stderr)){
                        console.warn(chalk.blue.bold("\t[%s] STD-WARNING: "), puzzleOffer.npm, stderr);
                        resolve(stderr);
                    }else{
                        console.error(chalk.red.bold("\t[%s] STD-ERROR: "), puzzleOffer.npm, stderr);
                        reject(stderr);
                    }
                }else if (stdout) {
                    console.log("\t[%s] stdout: ", puzzleOffer.npm, stdout);
                    resolve(stdout);
                }else{
                    resolve("OK");
                }
            }.bind(this));
        });
    }

    async buildPuzzles(): Promise<any>{
        console.log("Building puzzles (`npm run build`-ing them) from the file '%s':", this.fileName);
        for (let id in this.colaboConfig.puzzles.offers) {
            let puzzleOffer: PuzzlesOfferDescription = this.colaboConfig.puzzles.offers[id];

            await this.buildPuzzle(puzzleOffer);
        }

        return Promise.resolve("OK");
    }
}