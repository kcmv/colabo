import { Component, OnInit } from "@angular/core";
import { RimaAAAService } from "@colabo-rima/f-aaa/rima-aaa.service";
import { UserData } from "@colabo-rima/f-aaa/userData";
import { KNode } from "@colabo-knalledge/f-core/code/knalledge/kNode";
import { Observable } from "rxjs";
import * as config from "@colabo-utils/i-config";

import {
  UtilsNotificationService,
  NotificationMsgType,
  NotificationMsg
} from "@colabo-utils/f-notifications";

@Component({
  selector: "app-index-moderator",
  templateUrl: "./index-moderator.component.html",
  styleUrls: ["./index-moderator.component.css"]
})
export class IndexModeratorComponent implements OnInit {
  public appTitle: string = config.GetGeneral("appTitle");

  constructor(
    private rimaAAAService: RimaAAAService,
    protected utilsNotificationService: UtilsNotificationService
  ) {}

  ngOnInit() {}

  get isLoggedIn(): Boolean {
    return this.rimaAAAService.getUser() !== null;
  }

  get isModerator() {
    return this.rimaAAAService.isModerator();
  }

  get loggedUser(): KNode {
    return this.rimaAAAService.getUser();
  }

  logOut() {
    this.rimaAAAService.logOut();
  }

  public userAvatar(): Observable<string> {
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
  }

  snack() {
    this.utilsNotificationService.addNotification({
      type: NotificationMsgType.Info,
      title: "NOTE:",
      msg: "userid: " + this.rimaAAAService.getUser()._id
    });
  }
}
