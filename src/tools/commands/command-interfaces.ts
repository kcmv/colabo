export interface ICommand{
    initialize():void;
    execute(cmd:any):void;
}

export interface ICommands{
    [id: string] : ICommand;
}