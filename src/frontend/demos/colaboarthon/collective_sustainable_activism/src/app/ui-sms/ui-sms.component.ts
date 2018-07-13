import { Component, OnInit } from '@angular/core';
import {SMSApiService} from './sms-api.service';

@Component({
  selector: 'app-ui-sms',
  templateUrl: './ui-sms.component.html',
  styleUrls: ['./ui-sms.component.css']
})
export class UiSmsComponent implements OnInit {

  public mobileNo:string =  "+381 64 2830738";
  public name:string =  "Sinisa Rudan";
  public background:string = 'poet';

  constructor(
    private sMSApiService:SMSApiService
  ) { }

  ngOnInit() {
  }

  register():void{
    let code:string = 'reg';

    let smsBody:string = code + '. ' + this.name + '. ' + this.background;
    let twillioSendJSON:string = "from: " + this.mobileNo + "; body:" + smsBody;
    console.log(twillioSendJSON);

    this.sMSApiService.create(twillioSendJSON)
      .subscribe(response => this.responseReceived(response));
  }

  responseReceived(response:string):void{
    console.log(response);
  }
}
