import { Component, OnInit } from '@angular/core';
import {RimaAAAService} from '@colabo-rima/f-aaa/rima-aaa.service';
import {UserData} from '@colabo-rima/f-aaa/userData';
import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';

import { UtilsNotificationService, NotificationMsgType, NotificationMsg } from '@colabo-utils/f-notifications';

@Component({
  selector: 'app-index-moderator',
  templateUrl: './index-moderator.component.html',
  styleUrls: ['./index-moderator.component.css']
})
export class IndexModeratorComponent implements OnInit {

  constructor(
    private RimaAAAService: RimaAAAService, protected utilsNotificationService: UtilsNotificationService
  ) {
  }

  ngOnInit() {
  }

  get isLoggedIn():Boolean{
    return this.RimaAAAService.getUser() !== null;
  }

  get loggedUser(): KNode {
    return this.RimaAAAService.getUser();
  }

  logOut(){
    this.RimaAAAService.logOut();
  }

  snack(){
    this.utilsNotificationService.addNotification({
      type: NotificationMsgType.Info,
      title: 'NOTE:',
      msg: 'userid: ' + this.RimaAAAService.getUser()._id
    });
  }
}
