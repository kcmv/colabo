const MODULE_NAME:string = "@colabo-topichat/f-talk";

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MapEngineService} from '../map-engine.service';

import { GetPuzzle } from '@colabo-utils/i-config';
import { UtilsNotificationService, NotificationMsgType, NotificationMsg } from '@colabo-utils/f-notifications';
import {Observable} from 'rxjs';

// https://www.npmjs.com/package/uuid
import * as uuidv1 from 'uuid/v1';

@Component({
  selector: 'map-engine-form',
  templateUrl: './map-engine.component.html',
  styleUrls: ['./map-engine.component.css']
})

export class MapEngineForm implements OnInit {
  public statusesStates:any = {
  };

  public messages = [
  ];
  
  public messageContent:string;
  protected puzzleConfig: any;

  constructor(
    private mapEngineService: MapEngineService,
    protected utilsNotificationService: UtilsNotificationService
  ) {
  }

  ngOnInit() {
  }

  scrollToBottom() {
    // https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
    // https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
    let scrolling_content = document.querySelector("#scrolling_content");
    scrolling_content.scrollTo(0, scrolling_content.scrollHeight);
  }  
}
