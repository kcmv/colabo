import { Component } from "@angular/core";
import {
  UtilsNotificationService,
  NotificationMsgType,
  NotificationMsg
} from "@colabo-utils/f-notifications";
import { GetPuzzle, GetGeneral } from "@colabo-utils/i-config";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";
  protected generalConfigBranding: any;
  // testing namespacing access,
  // as it will be in code written in JS

  constructor(protected utilsNotificationService: UtilsNotificationService) {
    console.log("AppComponent:constructor");

    this.generalConfigBranding = GetGeneral("branding");

    this.utilsNotificationService.addNotification({
      type: NotificationMsgType.Info,
      title: this.generalConfigBranding.title,
      msg: "starting ..."
    });
  }

  ngOnInit() {}
}
