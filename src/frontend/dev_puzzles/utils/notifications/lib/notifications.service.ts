const MODULE_NAME: string = "@colabo-utils/f-notifications";
console.log("topiChat-core.service.ts");

import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { SnackBarNotificationComponent } from './snack-bar-notification/snack-bar-notification-component';

import { NotificationMsgType, NotificationMsg } from './notification-vos';

import {
  MatSnackBar, MAT_SNACK_BAR_DATA
} from '@angular/material';

import {GetPuzzle} from '@colabo-utils/i-config';

@Injectable()
export class UtilsNotificationService{
  public notifications: any = {};

  constructor(
    public snackBar: MatSnackBar
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

  openSnackBar(notification: NotificationMsg) {
    this.snackBar.openFromComponent(SnackBarNotificationComponent, {
      duration: 3000,
      data: notification
    });
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
    console.log("[%s] (%s) title:%s, msg: %s", MODULE_NAME, notification.type, notification.title, notification.msg);
    this.openSnackBar(notification);
  }
}
