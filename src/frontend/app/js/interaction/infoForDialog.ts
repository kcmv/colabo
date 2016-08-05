export class InfoForDialog{
  public title: string = "CollaboFramework";
  public message: string = "";
  public buttons: string[] = ["ok"];

  constructor(message?:string, title?:string, buttons?:string[]){
    if(message){this.message=message;}
    if(title){this.title = title;}
    if(buttons){this.buttons = buttons;}
  }
}
