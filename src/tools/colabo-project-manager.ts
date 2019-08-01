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
import {ColaboTemplateManager} from './colabo-template-manager';

enum AppTypes {
    Frontend = "frontend",
    Backend = "backend",
    Isomorphic = "isomorphic",
    Service = "service"
}

export class ColaboProjectManager{
    protected currentFolder:string;
    protected templatesFolder: string;
    protected colaboTemplateManager:ColaboTemplateManager;

    constructor(){
        this.currentFolder = process.cwd();
        this.templatesFolder = fs.realpathSync(__dirname+"/../templates/project");
        this.colaboTemplateManager = new ColaboTemplateManager(this.templatesFolder, 'template-info.json');
    }

    _createProject(projectInfo){
        this.colaboTemplateManager.parse();
        let projectFolder = this.currentFolder + "/" + projectInfo.ppath;
        // fs.mkdirSync(projectFolder, { recursive: true, mode: 0o775 });
        // fs.mkdirSync(projectFolder+"/lib", { recursive: true, mode: 0o775 });
        console.log(chalk.dim("Templates folder: '%s'"), chalk.bold(this.templatesFolder));
        let frontendTemplate = this.templatesFolder + "/frontend";

        function renderParameters(key:string){
            let readmeView:any;
            switch(key){
                case 'README.md':
                    readmeView = {
                        'pname': projectInfo.pname,
                        // 'project': this.colaboConfig.puzzles.name,
                        'pdescription': projectInfo.pdescription
                    };
                    break;
                case 'package.json':
                    readmeView = {
                        'pname': projectInfo.pname,
                        'pversion': projectInfo.pversion,
                        // 'project': this.colaboConfig.puzzles.name,
                        'pdescription': projectInfo.pdescription,
                        'prepository': projectInfo.prepository
                    };
                    break;
            }
            return readmeView;
        }

        this.colaboTemplateManager.execute(projectFolder, renderParameters)

        return;

    // README.md
        // fs.copyFileSync(frontendTemplate + "/README.md", projectFolder + "/README.md");

        let readmeString = fs.readFileSync(frontendTemplate + "/README.md", { encoding: 'utf8', flag: 'r' });

        let readmeView = {
            'pname': projectInfo.pname,
            // 'project': this.colaboConfig.puzzles.name,
            'pdescription': projectInfo.pdescription
        };

        // https://www.npmjs.com/package/mustache
        // https://www.npmjs.com/package/@types/mustache
        readmeString = Mustache.render(readmeString, readmeView);

        fs.writeFileSync(projectFolder + "/README.md", readmeString, { encoding: 'utf8', mode: 0o664 })

    // package.json
        let packageString = fs.readFileSync(frontendTemplate + "/package.json", { encoding: 'utf8', flag: 'r' });
        let packageView = {
            'pname': projectInfo.pname,
            'pversion': projectInfo.pversion,
            // 'project': this.colaboConfig.puzzles.name,
            'pdescription': projectInfo.pdescription,
            'prepository': projectInfo.prepository
        };

        packageString = Mustache.render(packageString, packageView);

        fs.writeFileSync(projectFolder + "/package.json", packageString, { encoding: 'utf8', mode: 0o664 })

    // tsconfig.json
        let tsconfigString = fs.readFileSync(frontendTemplate + "/tsconfig.json", { encoding: 'utf8', flag: 'r' });
        let tsconfigView = {
            'pname': projectInfo.pname,
            'ppversion': projectInfo.pversion,
            // 'project': this.colaboConfig.puzzles.name,
            'pdescription': projectInfo.pdescription,
            // here we use tripple brackets
            // `"url": "{{{ repository }}}"`
            // https://github.com/5thWall/mustache-render/issues/24
            // to disable escaping
            'repository': projectInfo.prepository
        };

        tsconfigString = Mustache.render(tsconfigString, tsconfigView);

        fs.writeFileSync(projectFolder + "/tsconfig.json", tsconfigString, { encoding: 'utf8', mode: 0o664 })

    // index.ts
        let indexString = fs.readFileSync(frontendTemplate + "/index.ts", { encoding: 'utf8', flag: 'r' });
        let indexView = {
            'pname': projectInfo.pname,
            'pversion': projectInfo.pversion,
            // 'project': this.colaboConfig.puzzles.name,
            'pdescription': projectInfo.pdescription,
            'prepository': projectInfo.prepository
        };

        indexString = Mustache.render(indexString, indexView);

        fs.writeFileSync(projectFolder + "/index.ts", indexString, { encoding: 'utf8', mode: 0o664 })
    }
    createProject(projectInfo){
        const typeMsg: string = "Project type:";
        const types: any[] = [
            AppTypes.Frontend,
            AppTypes.Backend,
            AppTypes.Isomorphic,
            AppTypes.Service
            // new Inquirer.Separator(),
        ];

        const nameMsg: string = "Project name:";
        const ppathMsg: string = "Project path (folder):";
        const pversionMsg: string = "Project version:"
        const descriptionMsg: string = "Project description:";
        const repositoryMsg: string = "Project repository:";
        
        // interact with user for any non-provided parameter
        let prompts:any[] = [];

        // type
        if (!projectInfo.ptype){
            prompts.push({
                type: "list",
                name: "ptype",
                default: "frontend",
                message: typeMsg,
                pageSize: 10,
                choices: types
            });
        }else{
            console.log(chalk.bold(typeMsg), chalk.dim(projectInfo.ptype));
        }

        // name
        if (!projectInfo.pname) {
            prompts.push({
                type: "input",
                name: "pname",
                message: nameMsg
            });
        } else {
            console.log(chalk.bold(nameMsg), chalk.dim(projectInfo.pname));
        }

        // path
        if (!projectInfo.ppath) {
            prompts.push({
                type: "input",
                name: "ppath",
                message: ppathMsg
            });
        } else {
            console.log(chalk.bold(nameMsg), chalk.dim(projectInfo.ppath));
        }

        // description
        if (!projectInfo.pdescription) {
            prompts.push({
                type: "input",
                name: "pdescription",
                message: descriptionMsg
            });
        } else {
            console.log(chalk.bold(descriptionMsg), chalk.dim(projectInfo.pdescription));
        }

        // version
        if (!projectInfo.pversion) {
            prompts.push({
                type: "input",
                name: "pversion",
                default: "0.0.1",
                message: pversionMsg
            });
        } else {
            console.log(chalk.bold(pversionMsg), chalk.dim(projectInfo.pversion));
        }

        // repository
        let gitUrlCommand: string = 'git config --get remote.origin.url';
        let repository: Buffer = child_process.execSync(gitUrlCommand, {});
        let repositoryStr: string = repository.toString();
        repositoryStr = repositoryStr.replace(/(\r|\n|\t)/gm, "");
        // console.log("repositoryStr: ", repositoryStr);

        if (!projectInfo.prepository) {
            prompts.push({
                type: "input",
                name: "prepository",
                default: repositoryStr,
                message: repositoryMsg
            });
        } else {
            console.log(chalk.bold(repositoryMsg), chalk.dim(projectInfo.prepository));
        }

        // confirm all parameters
        prompts.push({
            type: 'confirm',
            name: 'satisfied',
            message: 'Are you satisfied with your answers?',
            choices: ['Yes - Create Project', 'No - Start Again']
        });

        // run inquirer and after it is finished create project (`this._createProject`)
        Inquirer
            .prompt(prompts)
            .then(_projectInfo => {
                // merge cli (`projectInfo`) and interactive (`_projectInfo`) parameters
                projectInfo = Object.assign({}, projectInfo, _projectInfo);
                this._createProject(projectInfo)
            });
    }
}