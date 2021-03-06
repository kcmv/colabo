import { MAT_SNACK_BAR_DATA } from "@angular/material";

import { Injectable, Inject, Component, OnInit } from "@angular/core";
import { NotificationMsgType, NotificationMsg } from "../notification-vos";

@Component({
  selector: "snack-bar-notification-component",
  templateUrl: "snack-bar-notification-component.html",
  styleUrls: ["./snack-bar-notification-component.css"]
})
export class SnackBarNotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public notification: NotificationMsg
  ) {}

  get isError(): boolean {
    return this.notification.type === NotificationMsgType.Error;
  }

  get isWarning(): boolean {
    return this.notification.type === NotificationMsgType.Warning;
  }

  get isInfo(): boolean {
    return this.notification.type === NotificationMsgType.Info;
  }
}
