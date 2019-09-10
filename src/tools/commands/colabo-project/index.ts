import {ICommand} from '../command-interfaces';

import { ColaboProjectManager } from './colabo-project-manager';

export class CommandColaboProject implements ICommand{
    constructor(){
        console.log("Command: Colabo Project");
    }

    initialize(){
        console.log("Command: Colabo Project - initializing");
    }

    execute(cmd:any){
        console.log("Command: Colabo Project - executing");
        let colaboProjectManager = new ColaboProjectManager();
        colaboProjectManager._createProject(cmd);
    }
}