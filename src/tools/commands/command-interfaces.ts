export interface SubCommandOption{
    parameter: string,
    description: string
}

export interface SubCommandInfo{
    name: string,
    description: string,
    options: SubCommandOption[]
}
export interface CommandInfo{
    name: string,
    subcommands: SubCommandInfo[]
}

export interface ICommand{
    initialize():void;
    getInfo():CommandInfo;
    execute(cmd:any):void;
}

import {ColaboTemplateManager} from '../colabo-template-manager';

import * as fs from 'fs';

export class ColaboCommand implements ICommand{
    protected currentFolder:string;
    protected commandInfo:CommandInfo;
    protected colaboTemplateManager:ColaboTemplateManager;

    constructor(protected templatesFolder: string, protected templateFileName:string, protected commandInfoPath:string){
        this.currentFolder = process.cwd();
        this.colaboTemplateManager = new ColaboTemplateManager(this.templatesFolder, 'template-info.json');

        try{
            this.commandInfo = <CommandInfo>require(this.commandInfoPath);
         }catch(e){
             console.error("Problem with importing the command info file: ", this.commandInfoPath);
             console.error("Error: ", e);
             process.exit(2);
         }
    }

    initialize():void{

    }

    getInfo():CommandInfo{
        return this.commandInfo;
    }

    execute(cmd:any):void{

    }

}
export interface ICommands{
    [id: string] : ICommand;
}