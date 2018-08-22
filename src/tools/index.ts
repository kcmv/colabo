#!/usr/bin/env node

// Provide a title to the process in `ps`.
// Due to an obscure Mac bug, do not start this title with any symbol.
process.title = 'colabo-tools';

// declare var require: any;
// declare var module: any;
// declare var process: any;

// TODO: not working
// import * as chalk from 'chalk';
var chalk = require('chalk');
import * as fs from 'fs';

// process.chdir
import { ColaboConfigParser } from './colabo-config-parser';

enum Commands {
    PuzzlesInfo = "puzzles-info",
    PuzlessOffer = "puzzles-offer",
    PuzlessInstall = "puzzles-install",
    SymLink = "symlinks"
}

console.log("Colabo tools");
console.log("============");

function showUsage(){
    console.log(chalk.red.bold("Usage:"));
    console.log("\t colabo [<config-file>] <command>");
    console.log(chalk.red.bold("Available Commands:"));
    console.log("\t%s: Show info about the colabo config file", chalk.blue.bold(Commands.PuzzlesInfo));
    console.log("\t%s: Exports puzzles offered through the colabo config file", chalk.blue.bold(Commands.PuzlessOffer));
    console.log("\t%s: Installs puzzles required by the colabo config file", chalk.blue.bold(Commands.PuzlessInstall));
    console.log("\t%s: Symlink external paths", chalk.blue.bold(Commands.SymLink));
    console.log(chalk.red.bold("Example:"));
    console.log("\t colabo ../backend/colabo.config.js puzzless-info", chalk.dim("// show puzzles from"), chalk.dim.bold('./backend/colabo.config.js'));
    console.log("\t colabo symlinks", chalk.dim("// do symbolic linking based on local file"), chalk.dim.bold('./colabo.config.js'));
}

if (process.argv.length < 3 || process.argv.length > 4) {
    console.log(chalk.red("Wrong"), chalk.red.bold("number of parameters"));
    showUsage();
    process.exit(1);
}

var configFile = "./colabo.config.js";
var command;

if (process.argv.length == 3) {
    command = process.argv[2];
}

if (process.argv.length == 4) {
    configFile = process.argv[2];
    command = process.argv[3];
}

var configFileFullUnresolved;
var configFileFull;

try {
    configFileFullUnresolved = process.cwd() + "/" + configFile
    configFileFull = fs.realpathSync(configFileFullUnresolved);
} catch (e) {
    console.error("Problem with resolving the config file `%s` -> `%s`", configFile, configFileFullUnresolved);
    console.error("Error: ", e);
    process.exit(2);
}

console.log(chalk.dim.italic("Environment Info:"));
console.log(chalk.dim.italic("\tconfigFile: ", configFile));
console.log(chalk.dim.italic("\tconfigFileFull: ", configFileFull));
console.log(chalk.dim.italic("\tcommand: ", command));
console.log(chalk.dim.italic("\tcurrent working folde: r", process.cwd()));
console.log(chalk.dim.italic("\tcurrent script folder: ", __dirname));
// console.log(chalk.dim.italic("changing local working folder ..."));
// console.log(chalk.dim.italic("new local working folder", __dirname));

console.log("colabo config file: ", configFile);

var colaboConfigParser = new ColaboConfigParser(configFile);
colaboConfigParser.parse();

switch(command){
    case Commands.PuzzlesInfo:
        colaboConfigParser.info();
        colaboConfigParser.listOffers();
        colaboConfigParser.listDependencies();
        break;
    case Commands.PuzlessOffer:
        colaboConfigParser.offerPuzzles()
            .catch(error => console.log(chalk.red.bold("Colabo action (%s) finished with error: "), Commands.PuzlessOffer, error));
        break;
    case Commands.PuzlessInstall:
        colaboConfigParser.installPuzzles()
            .catch (error => console.log(chalk.red.bold("Colabo action (%s) finished with error: "), Commands.PuzlessInstall, error));
        break;
    case Commands.SymLink:
        colaboConfigParser.symlinks()
            .catch (error => console.log(chalk.red.bold("Colabo action (%s) finished with error: "), Commands.SymLink, error));
        break;
    default:
        console.log(chalk.red("Wrong command:"), chalk.red.bold(command));
        showUsage();
        break;
}