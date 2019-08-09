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
// import * as chalk from 'chalk';
import * as fs from 'fs';
// https://github.com/sindresorhus/ora
// spinners list
// https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json
import * as Ora from 'ora';
// Emoji list
// https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
import * as Emoji from 'node-emoji';

// process.chdir
import { ColaboConfigParser } from './colabo-config-parser';
import { ColaboPuzzleManager } from './colabo-puzzle-manager';
import { ColaboProjectManager } from './colabo-project-manager';

enum Commands {
    ToolVersion = "-v",
    ToolHelp = "-h",
    ToolConfigFile = "-c",

    PuzzlesInfo = "puzzles-info",
    PuzlesBuild = "puzzles-build",
    PuzlesOffer = "puzzles-offer",
    PuzlesInstall = "puzzles-install",

    PuzzleCreate = "puzzle-create",

    ProjectCreate = "project-create",

    SymLink = "symlinks"
}

console.log(
    chalk.red.bold("Co") + chalk.blue.bold("Lab") + chalk.green.bold("o CLI tools")
);
console.log("============");

let colaboConfigParser;
let colaboConfig;
let colaboPuzzleManager;
let colaboProjectManager;

function processGlobalParams(cmd){
    cmd.parent.config;
    var configFile = (cmd && cmd.parent && cmd.parent.config) || "./colabo.config.js";
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
    // console.log(chalk.dim.italic("\tconfigFile: ", configFile));
    console.log(chalk.dim.italic("\tconfigFile: ", configFileFull));
    // console.log(chalk.dim.italic("\tcurrent working folde: r", process.cwd()));
    console.log(chalk.dim.italic("\tcurrent script folder: ", __dirname));
    // console.log(chalk.dim.italic("changing local working folder ..."));
    // console.log(chalk.dim.italic("new local working folder", __dirname));

    // console.log("colabo config file: ", configFile);

    colaboConfigParser = new ColaboConfigParser(configFile);
    colaboConfigParser.parse();
    colaboConfig = colaboConfigParser.getConfig();

    colaboPuzzleManager = new ColaboPuzzleManager(colaboConfig);
}

// https://stackoverflow.com/questions/9153571/is-there-a-way-to-get-version-from-package-json-in-nodejs-code
const version = require('../package.json').version;
var program = require('commander');
import * as readline from 'readline';

program
    .version(version, '-v, --version')
    .option('-c --config <config>')

import { inspect } from 'util' // or directly

program
    .command(Commands.PuzzleCreate)
    .option('-n --pname <puzzleName>', 'Puzzle name')
    .option('-p --ppath <puzzlePath>', 'Puzzle path (folder)')
    .option('-d --pdescription <puzzleDesc>', 'Puzzle description')
    .option('-t --ptype <puzzleType>', 'Type of the puzzle')
    .option('-pv --pversion <puzzleVersion>', 'Puzzle version. It follows https://semver.org/')
    .option('-l --plicense <puzzleLicense>', 'The license of the puzzle')
    .option('-r --prepository <repositoryUrl>', 'The url of the puzzle\'s repository')
    .action(function (cmd) {
        processGlobalParams(cmd);
        // console.log(inspect(cmd))
        // console.log("cmd.pname: ", cmd.pname);
        // console.log("cmd.pversion: ", cmd.pversion);
        colaboPuzzleManager.createPuzzle(cmd);
    })

program
    .command(Commands.ProjectCreate)
    .option('-n --pname <projectName>', 'Project name')
    .option('-p --ppath <projectPath>', 'Project path (folder)')
    .option('-d --pdescription <projectDesc>', 'Project description')
    .option('-t --ptype <projectType>', 'Type of the project')
    .option('-pv --pversion <projectVersion>', 'Project version. It follows https://semver.org/')
    .option('-l --plicense <projectLicense>', 'The license of the project')
    .option('-r --prepository <repositoryUrl>', 'The url of the project\'s repository')
    .action(function (cmd) {
        colaboProjectManager = new ColaboProjectManager();
        // processGlobalParams(cmd);
        colaboProjectManager.createProject(cmd);
    })

program
    .command(Commands.PuzzlesInfo)
    .action(function (cmd) {
        processGlobalParams(cmd);
        colaboConfigParser.info();
        colaboConfigParser.listOffers();
        colaboConfigParser.listDependencies();
    })

program
    .command(Commands.PuzlesBuild)
    .action(function (cmd) {
        processGlobalParams(cmd);
        let spinner = (<any>Ora)({
            text: chalk.yellow.bold('Building puzzles ...'),
            color: 'yellow',
            spinner: 'weather'
        }).start();
        colaboConfigParser.buildPuzzles().then(function () {
            spinner.stopAndPersist({
                symbol: Emoji.get('unicorn_face'),
                text: chalk.green.bold('Building puzzles succesfully finished')
            })
        }).catch(error => {
            spinner.stopAndPersist({
                symbol: Emoji.get('broken_heart'),
                text: chalk.red.bold("Colabo action (" + Commands.PuzlesBuild + ") finished with error: " + error)
            })
        });
    })

program
    .command(Commands.PuzlesOffer)
    .action(function (cmd) {
        processGlobalParams(cmd);
        let spinner = (<any>Ora)({
            text: chalk.yellow.bold('Offering puzzles ...'),
            color: 'yellow',
            spinner: 'weather'
        }).start();
        colaboConfigParser.offerPuzzles().then(function () {
            spinner.stopAndPersist({
                symbol: Emoji.get('unicorn_face'),
                text: chalk.green.bold('Offering puzzles succesfully finished')
            })
        }).catch(error => {
            spinner.stopAndPersist({
                symbol: Emoji.get('broken_heart'),
                text: chalk.red.bold("Colabo action (" + Commands.PuzlesOffer + ") finished with error: " + error)
            })
        });
    })

program
    .command(Commands.PuzlesInstall)
    .action(function (cmd) {
        processGlobalParams(cmd);
        let spinner = (<any>Ora)({
            text: chalk.yellow.bold('Installing puzzles ...'),
            color: 'yellow',
            spinner: 'weather'
        }).start();
        colaboConfigParser.installPuzzles()
            .then(function () {
                spinner.stopAndPersist({
                    symbol: Emoji.get('unicorn_face'),
                    text: chalk.green.bold('Installing puzzles succesfully finished')
                })
            }).catch (error => {
                spinner.stopAndPersist({
                    symbol: Emoji.get('broken_heart'),
                    text: chalk.red.bold("Colabo action (" + Commands.PuzlesInstall + ") finished with error: " + error)
                })
            });
    })

program
    .command(Commands.SymLink)
    .action(function (cmd) {
        processGlobalParams(cmd);
        let spinner = (<any>Ora)({
            text: chalk.yellow.bold('Creating symbolic links ...'),
            color: 'yellow',
            spinner: 'weather'
        }).start();
        colaboConfigParser.symlinks().then(function () {
            spinner.stopAndPersist({
                symbol: Emoji.get('unicorn_face'),
                text: chalk.green.bold('Creating symbolic links succesfully finished')
            })
        }).catch(error => {
            spinner.stopAndPersist({
                symbol: Emoji.get('broken_heart'),
                text: chalk.red.bold("Colabo action (" + Commands.SymLink + ") finished with error: " + error)
            })
        });
    })

program
    .parse(process.argv);

// process.exit(0);

function showUsage(){
    // info
    console.log(chalk.red.bold("Usage:"));
    console.log("\t colabo [<config-file>] <command>");
    console.log(chalk.red.bold("Available Commands:"));
    console.log("\t%s: Show the version of the Colabo Tool", chalk.blue.bold(Commands.ToolVersion));
    console.log("\t%s: Show this help info", chalk.blue.bold(Commands.ToolHelp));
    console.log("\t%s: Provide colabo.config file, explicitly", chalk.blue.bold(Commands.ToolConfigFile));

    // puzzles
    console.log("\t%s: Show info about the colabo config file", chalk.blue.bold(Commands.PuzzlesInfo));
    console.log("\t%s: Builds puzzles offered through the colabo config file", chalk.blue.bold(Commands.PuzlesBuild));
    console.log("\t%s: Exports puzzles offered through the colabo config file", chalk.blue.bold(Commands.PuzlesOffer));
    console.log("\t%s: Installs puzzles required by the colabo config file", chalk.blue.bold(Commands.PuzlesInstall));

    // puzzle
    console.log("\t%s: Create Puzzle", chalk.blue.bold(Commands.PuzzleCreate));

    // project
    console.log("\t%s: Create Project", chalk.blue.bold(Commands.ProjectCreate));

    // general
    console.log("\t%s: Symlink external paths", chalk.blue.bold(Commands.SymLink));

    // examples
    console.log(chalk.red.bold("Example:"));
    console.log("\t colabo ../backend/colabo.config.js puzzless-info", chalk.dim("// show puzzles from"), chalk.dim.bold('./backend/colabo.config.js'));
    console.log("\t colabo symlinks", chalk.dim("// do symbolic linking based on local file"), chalk.dim.bold('./colabo.config.js'));
}

// let spinner = null;

// setTimeout(() => {
//     spinner.color = 'yellow';
//     spinner.text = 'Loading rainbows';
// }, 1000);