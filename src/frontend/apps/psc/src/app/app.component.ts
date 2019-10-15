import { ColaboFlowService } from "@colabo-flow/f-core";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
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

  constructor(
    protected utilsNotificationService: UtilsNotificationService,
    private colaboFlowService: ColaboFlowService,
    route: ActivatedRoute
  ) {
    console.log("[AppComponent:constructor]");

    this.generalConfigBranding = GetGeneral("branding");

    this.utilsNotificationService.addNotification({
      type: NotificationMsgType.Info,
      title: this.generalConfigBranding.title,
      msg: "starting ..."
    });

    // const url: Observable<string> = route.url.pipe(
    //   map(segments => segments.join(""))
    // );
    // url.subscribe((url: string) => {
    //   console.log("[AppComponent::constructor] url:", url);
    //   this.colaboFlowService.startKeepingMyState(url);
    // });
    // console.log(
    //   "[AppComponent::constructor] route",

    //   route
    // );
  }

  ngOnInit() {}
}
