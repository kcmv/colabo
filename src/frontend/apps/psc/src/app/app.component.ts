import { Component } from "@angular/core";
// import {SDGsService} from './select-sdgs/sdgs.service';
// import {RimaAAAService} from '@colabo-rima/f-aaa/rima-aaa.service';
// import {CWCService} from './cwc/cwc.service';

// TESTING
import {
  UtilsNotificationService,
  NotificationMsgType,
  NotificationMsg
} from "@colabo-utils/f-notifications";
// TESTING
import { GetPuzzle, GetGeneral } from "@colabo-utils/i-config";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "Colabo.Space - PSC";
  protected generalConfigBranding: any;
  // testing namespacing access,
  // as it will be in code written in JS

  constructor() // private sDGsService: SDGsService,
  // private RimaAAAService: RimaAAAService,
  // private cwcService: CWCService
  // TESTING
  // protected utilsNotificationService: UtilsNotificationService
  {
    console.log("AppComponent:constructor");

    // TESTING
    this.generalConfigBranding = GetGeneral("branding");

    // this.utilsNotificationService.addNotification({
    //   type: NotificationMsgType.Info,
    //   title: this.generalConfigBranding.title,
    //   msg: 'starting ...'
    // }
    // );
  }

  ngOnInit() {
    //this.sDGsService.
  }
}
