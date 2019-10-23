const MODULE_NAME: string = "@colabo-utils/f-notifications";
console.log("topiChat-core.service.ts");
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { BottomShDgData, BottomShDg } from "./bottom-sh-dg/bottom-sh-dg";

import { Injectable, Inject } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { SnackBarNotificationComponent } from "./snack-bar-notification/snack-bar-notification-component";

import { NotificationMsgType, NotificationMsg } from "./notification-vos";

import { MatSnackBar, MAT_SNACK_BAR_DATA } from "@angular/material";

@Injectable()
export class UtilsNotificationService {
  public notifications: any = {};

  constructor(
    public snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {
    this.init();
  }

  /**
   * Initializes service
   */
  init() {
    for (let infoTypeId in NotificationMsgType) {
      let infoType: string = NotificationMsgType[infoTypeId];
      this.notifications[infoType] = [];
    }
  }

  clearNotifications(type: string) {
    this.notifications[type].length = 0;
  }

  openBottomSheet(notification: NotificationMsg): void {
    let BottomShDgData: BottomShDgData = {
      title: notification.title,
      message: notification.msg,
      btn1: "OK"
    };
    let bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(BottomShDg, {
      data: BottomShDgData,
      disableClose: true
    });
  }

  openSnackBar(notification: NotificationMsg) {
    if (notification.type === NotificationMsgType.Error) {
      // we COULD use SnackBar even for the eror with `duration = 0` but the SnackBar is not by Material documentation itended to be permanent,
      // but a temporary notification (and there is no official statement on permanent duration parameter, even some docs says that duration should be set to -1)
      this.openBottomSheet(notification);
    } else {
      this.snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration:
          notification.type === NotificationMsgType.Warning ? 6000 : 3000,
        data: notification
      });
    }
  }

  /*
  {
        type: NotificationMsg.Info,
        title: 'NOTE:',
        msg: 'You should provide between 3 and 5 toughts'
      }
  */

  addNotification(notification: NotificationMsg) {
    // this.notifications[notification.type].push(notification);
    console.log(
      "[%s] (%s) title:%s, msg: %s",
      MODULE_NAME,
      notification.type,
      notification.title,
      notification.msg
    );
    this.openSnackBar(notification);
  }
}
