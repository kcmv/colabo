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

enum AppTypes {
    Frontend = "frontend",
    Backend = "backend",
    Isomorphic = "isomorphic",
    Service = "service"
}

const templatesFolder:string = "/../../../commands/colabo-project/templates";
const templateFileName:string = "template-info.json";
const commandInfoPathRelative:string = "/../../../commands/colabo-project/command-info.json";

import {ICommand, CommandInfo, ColaboCommand} from '../command-interfaces';

export class CommandColaboProject extends ColaboCommand{

    constructor(){
        console.log("[CommandColaboProject] __dirname: ", __dirname);
        let templatesFolderFull:string = fs.realpathSync(__dirname+templatesFolder);
        let commandInfoPath:string = fs.realpathSync(__dirname+commandInfoPathRelative);
        super(templatesFolderFull, templateFileName, commandInfoPath);
    }

    initialize(){
        console.log("Command: Colabo Project - initializing");
    }

    execute(projectInfo:any){
        console.log("Command: Colabo Project - executing");

        this.templateManager.parse();
        let projectFolder = this.currentFolder + "/" + projectInfo.ppath;
        // fs.mkdirSync(projectFolder, { recursive: true, mode: 0o775 });
        // fs.mkdirSync(projectFolder+"/lib", { recursive: true, mode: 0o775 });
        console.log(chalk.dim("Templates folder: '%s'"), chalk.bold(this.templatesFolder));
        let frontendTemplate = this.templatesFolder + "/frontend";

        function renderParameters(key:string){
            let readmeView:any;

            readmeView = {
                'pname': projectInfo.pname,
                // 'apptype': projectInfo.pname,
                'pversion': projectInfo.pversion,
                'pdescription': projectInfo.pdescription,
                'prepository': projectInfo.prepository,
                'plicense': projectInfo.plicense
            };

            switch(key){
                case 'README.md':
                    break;
                case 'src/frontend/apps/<pname>/package.json':
                    break;
            }
            return readmeView;
        }

        this.templateManager.execute(projectFolder, renderParameters, "frontend");
    }

    _createProject(projectInfo:any){
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
        const plicenseMsg: string = "Project license:";
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

        // license
        if (!projectInfo.plicense) {
            prompts.push({
                type: "input",
                name: "plicense",
                default: "MIT",
                message: plicenseMsg
            });
        } else {
            console.log(chalk.bold(plicenseMsg), chalk.dim(projectInfo.plicense));
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