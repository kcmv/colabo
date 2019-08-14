import {ICommand} from '../command-interfaces';

export class CommandColaboPuzzle implements ICommand{
    constructor(){
        console.log("Command: Colabo Puzzle");
    }

    initialize(){
        console.log("Command: Colabo Puzzle - initializing");
    }

    execute(cmd:any){
        console.log("Command: Colabo Puzzle - executing");
    }

}