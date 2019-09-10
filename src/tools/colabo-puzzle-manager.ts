// TODO: not working
// import * as chalk from 'chalk';
var chalk = require('chalk');
import * as fs from 'fs';

// https://www.npmjs.com/package/mustache
// https://www.npmjs.com/package/@types/mustache
import * as Mustache from 'mustache';
import * as Ora from 'ora';
import * as Inquirer from 'inquirer';
import * as child_process from 'child_process';

enum PuzzleTypes {
    Frontend = "frontend",
    Backend = "backend",
    Isomorphic = "isomorphic",
    Service = "service"
}

export class ColaboPuzzleManager{
    protected currentFolder:string;
    protected templatesFolder: string;
    constructor(protected colaboConfig:any){
        this.currentFolder = process.cwd();
        this.templatesFolder = fs.realpathSync(__dirname+"/../templates/puzzles");
        
    }

    _createPuzzle(puzzleInfo){
        let puzzleFolder = this.currentFolder + "/" + puzzleInfo.ppath;
        console.log("Creating puzzle: '%s' in folder '%s'", chalk.bold.dim.italic(puzzleInfo.ppath), chalk.bold.italic(puzzleFolder));
        fs.mkdirSync(puzzleFolder, { recursive: true, mode: 0o775 });
        fs.mkdirSync(puzzleFolder+"/lib", { recursive: true, mode: 0o775 });
        console.log(chalk.dim("Templates folder: '%s'"), chalk.bold(this.templatesFolder));
        let frontendTemplate = this.templatesFolder + "/frontend";

    // README.md
        // fs.copyFileSync(frontendTemplate + "/README.md", puzzleFolder + "/README.md");

        let readmeString = fs.readFileSync(frontendTemplate + "/README.md", { encoding: 'utf8', flag: 'r' });

        let readmeView = {
            'pname': puzzleInfo.pname,
            'project': this.colaboConfig.puzzles.name,
            'pdescription': puzzleInfo.pdescription
        };

        // https://www.npmjs.com/package/mustache
        // https://www.npmjs.com/package/@types/mustache
        readmeString = Mustache.render(readmeString, readmeView);

        fs.writeFileSync(puzzleFolder + "/README.md", readmeString, { encoding: 'utf8', mode: 0o664 })

    // package.json
        let packageString = fs.readFileSync(frontendTemplate + "/package.json", { encoding: 'utf8', flag: 'r' });
        let packageView = {
            'pname': puzzleInfo.pname,
            'pversion': puzzleInfo.pversion,
            'project': this.colaboConfig.puzzles.name,
            'pdescription': puzzleInfo.pdescription,
            'prepository': puzzleInfo.prepository
        };

        packageString = Mustache.render(packageString, packageView);

        fs.writeFileSync(puzzleFolder + "/package.json", packageString, { encoding: 'utf8', mode: 0o664 })

    // tsconfig.json
        let tsconfigString = fs.readFileSync(frontendTemplate + "/tsconfig.json", { encoding: 'utf8', flag: 'r' });
        let tsconfigView = {
            'pname': puzzleInfo.pname,
            'ppversion': puzzleInfo.pversion,
            'project': this.colaboConfig.puzzles.name,
            'pdescription': puzzleInfo.pdescription,
            // here we use tripple brackets
            // `"url": "{{{ repository }}}"`
            // https://github.com/5thWall/mustache-render/issues/24
            // to disable escaping
            'repository': puzzleInfo.prepository
        };

        tsconfigString = Mustache.render(tsconfigString, tsconfigView);

        fs.writeFileSync(puzzleFolder + "/tsconfig.json", tsconfigString, { encoding: 'utf8', mode: 0o664 })

    // index.ts
        let indexString = fs.readFileSync(frontendTemplate + "/index.ts", { encoding: 'utf8', flag: 'r' });
        let indexView = {
            'pname': puzzleInfo.pname,
            'pversion': puzzleInfo.pversion,
            'project': this.colaboConfig.puzzles.name,
            'pdescription': puzzleInfo.pdescription,
            'prepository': puzzleInfo.prepository
        };

        indexString = Mustache.render(indexString, indexView);

        fs.writeFileSync(puzzleFolder + "/index.ts", indexString, { encoding: 'utf8', mode: 0o664 })
    }
    createPuzzle(puzzleInfo){
        const typeMsg: string = "Puzzle type:";
        const types: any[] = [
            PuzzleTypes.Frontend,
            PuzzleTypes.Backend,
            PuzzleTypes.Isomorphic,
            PuzzleTypes.Service
            // new Inquirer.Separator(),
        ];

        const nameMsg: string = "Puzzle name:";
        const ppathMsg: string = "Puzzle path (folder):";
        const pversionMsg: string = "Puzzle version:"
        const descriptionMsg: string = "Puzzle description:";
        const plicenseMsg: string = "Puzzle license:";
        const repositoryMsg: string = "Puzzle repository:";
        
        let prompts:any[] = [];
        if (!puzzleInfo.ptype){
            prompts.push({
                type: "list",
                name: "ptype",
                default: "frontend",
                message: typeMsg,
                pageSize: 10,
                choices: types
            });
        }else{
            console.log(chalk.bold(typeMsg), chalk.dim(puzzleInfo.ptype));
        }
        if (!puzzleInfo.pname) {
            prompts.push({
                type: "input",
                name: "pname",
                message: nameMsg
            });
        } else {
            console.log(chalk.bold(nameMsg), chalk.dim(puzzleInfo.pname));
        }
        if (!puzzleInfo.ppath) {
            prompts.push({
                type: "input",
                name: "ppath",
                message: ppathMsg
            });
        } else {
            console.log(chalk.bold(nameMsg), chalk.dim(puzzleInfo.ppath));
        }
        if (!puzzleInfo.pdescription) {
            prompts.push({
                type: "input",
                name: "pdescription",
                message: descriptionMsg
            });
        } else {
            console.log(chalk.bold(descriptionMsg), chalk.dim(puzzleInfo.pdescription));
        }
        if (!puzzleInfo.pversion) {
            prompts.push({
                type: "input",
                name: "pversion",
                default: "0.0.1",
                message: pversionMsg
            });
        } else {
            console.log(chalk.bold(pversionMsg), chalk.dim(puzzleInfo.pversion));
        }
        if (!puzzleInfo.plicense) {
            prompts.push({
                type: "input",
                name: "plicense",
                default: "MIT",
                message: plicenseMsg
            });
        } else {
            console.log(chalk.bold(plicenseMsg), chalk.dim(puzzleInfo.plicense));
        }

        let gitUrlCommand: string = 'git config --get remote.origin.url';
        let repository: Buffer = child_process.execSync(gitUrlCommand, {});
        let repositoryStr: string = repository.toString();
        repositoryStr = repositoryStr.replace(/(\r|\n|\t)/gm, "");
        // console.log("repositoryStr: ", repositoryStr);

        if (!puzzleInfo.prepository) {
            prompts.push({
                type: "input",
                name: "prepository",
                default: repositoryStr,
                message: repositoryMsg
            });
        } else {
            console.log(chalk.bold(repositoryMsg), chalk.dim(puzzleInfo.prepository));
        }

        prompts.push({
            type: 'confirm',
            name: 'satisfied',
            message: 'Are you satisfied with your answers?',
            choices: ['Yes - Create Puzzle', 'No - Start Again']
        });

        Inquirer
            .prompt(prompts)
            .then(_puzzleInfo => {
                // merge cli (`puzzleInfo`) and interactive (`_puzzleInfo`) parameters
                puzzleInfo = Object.assign({}, puzzleInfo, _puzzleInfo);
                this._createPuzzle(puzzleInfo)
            });
    }
}