const MODULE_NAME:string = "@colabo-topichat/f-talk";

import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {Observable} from 'rxjs';
import * as d3 from 'd3';

import { MapEngineService } from '../map-engine.service';
import { GetPuzzle } from '@colabo-utils/i-config';
import { UtilsNotificationService, NotificationMsgType, NotificationMsg } from '@colabo-utils/f-notifications';
import { MapWithContent } from '@colabo-knalledge/f-store_core';
import { MapBuilder } from '../map-builder';

@Component({
  selector: 'map-engine-form',
  templateUrl: './map-engine.component.html',
  styleUrls: ['./map-engine.component.css', '../map.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MapEngineForm implements OnInit, AfterViewInit {
  public statusesStates:any = {
  };

  public showDemoLayout:boolean = false;
  public messages = [
  ];
  protected mapBuilder: MapBuilder;
  contentHtml:any;

  public messageContent:string;
  protected puzzleConfig: any;

  constructor(
    private mapEngineService: MapEngineService,
    protected utilsNotificationService: UtilsNotificationService
  ) {
    this.mapBuilder = new MapBuilder();
  }

  ngOnInit() {
    this.mapEngineService.getMap().subscribe(this.drawMap.bind(this));
  }
  
  ngAfterViewInit(){ // the component is rendered and DOM is accessible to the D3
    this.contentHtml = d3.select("#map-container").select(".content-html");
    this.mapBuilder.setContentHtml(this.contentHtml);
  }
  
  drawMap(mapContent: MapWithContent){
    this.mapBuilder.setMapContent(mapContent);
    this.mapBuilder.buildMap();
  }

  scrollToBottom() {
    // https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
    // https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
    let scrolling_content = document.querySelector("#scrolling_content");
    scrolling_content.scrollTo(0, scrolling_content.scrollHeight);
  }  
}
