import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ui-sms',
  templateUrl: './ui-sms.component.html',
  styleUrls: ['./ui-sms.component.css']
})
export class UiSmsComponent implements OnInit {

  public mobileNo:string =  "+381 64 2830738";
  public name:string =  "Sinisa Rudan";
  public background:string = 'poet';

  constructor() { }

  ngOnInit() {
  }

  register():void{
    let code:string = 'reg';

    let smsBody:string = code + '. ' + this.name + '. ' + this.background;
    let twillioSendJSON:string = "from: " + this.mobileNo + "; body:" + smsBody;
    console.log(twillioSendJSON);
  }


}
