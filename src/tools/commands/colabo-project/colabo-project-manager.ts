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
import {ColaboTemplateManager} from '../../colabo-template-manager';

enum AppTypes {
    Frontend = "frontend",
    Backend = "backend",
    Isomorphic = "isomorphic",
    Service = "service"
}

const templatesFloder:string = "/../../../commands/colabo-project/templates";

export class ColaboProjectManager{
    protected currentFolder:string;
    protected templatesFolder: string;
    protected colaboTemplateManager:ColaboTemplateManager;

    constructor(){
        this.currentFolder = process.cwd();
        console.log("[ColaboProjectManager] __dirname: ", __dirname);
        this.templatesFolder = fs.realpathSync(__dirname+templatesFloder);
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

        this.colaboTemplateManager.execute(projectFolder, renderParameters, "frontend");
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