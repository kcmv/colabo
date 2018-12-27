const MODULE_NAME:string = "@colabo-topichat/f-talk";

import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {Observable} from 'rxjs';
import * as d3 from 'd3';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { tap, map, switchMap } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

import { MapEngineService } from '../map-engine.service';
import { GetPuzzle } from '@colabo-utils/i-config';
import { UtilsNotificationService, NotificationMsgType, NotificationMsg } from '@colabo-utils/f-notifications';
import { MapWithContent, KMap } from '@colabo-knalledge/f-store_core';
import { MapBuilder, ErrorData } from '../map-builder';

@Component({
  selector: 'map-engine-form',
  templateUrl: './map-engine.component.html',
  styleUrls: ['./map-engine.component.scss', '../map.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MapEngineForm implements OnInit, AfterViewInit {
  public map:KMap;
  public statusesStates:any = {
  };

  public showDemoLayout:boolean = false;
  public messages = [
  ];
  public mapBuilder: MapBuilder;
  contentHtml:any;
  contentSvg:any;

  public messageContent:string;
  protected puzzleConfig: any;
  mapId:string = '58068a04a37162160341d402';

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    // private router: Router,
    private mapEngineService: MapEngineService,
    protected utilsNotificationService: UtilsNotificationService
  ) {
    this.mapBuilder = new MapBuilder();
  }

  ngOnInit() {
    /*
    //implemented: https://github.com/Cha-OS/colabo/issues/454
    this.route.paramMap.pipe(
      tap((params: ParamMap) => { this.mapId = params.get('id'); console.log("this.mapId",this.mapId);}),
      // switchMap((params: ParamMap) =>
      map((params: ParamMap) =>
        // this.service.getHero(params.get('id')))
        this.mapEngineService.getMap(params.get('id')))
    ).subscribe(this.drawMap.bind(this));
    */

    //this.mapEngineService.getMap(this.mapId).subscribe(this.drawMap.bind(this));
    this.route.paramMap.subscribe(this.paramsReceived.bind(this));
    this.mapBuilder.getErrors().subscribe(this.onError.bind(this));
  }

  paramsReceived(params: ParamMap){
    console.log('[paramsReceived]',params);
    console.log('[paramsReceived]mapId',params.get('id'));
    this.mapId = params.get('id');
    this.getMap(this.mapId);
  }

  onError(e:ErrorData):void{
    this.snackBar.open("Error", e.msg, {duration: 3000});
  }
  
  getMap(mapId:string){
    this.mapEngineService.getMap(mapId).subscribe(this.drawMap.bind(this));
  }
  
  ngAfterViewInit(){ // the component is rendered and DOM is accessible to the D3
    this.contentHtml = d3.select("#map-container").select(".content-html");
    this.contentSvg = d3.select("#map-container").select(".content-svg");
    this.mapBuilder
      .setContentHtml(this.contentHtml)
      .setContentSvg(this.contentSvg);
    
  }
  
  drawMap(mapContent: MapWithContent){
    this.mapBuilder.setMapContent(mapContent);
    this.mapBuilder.buildMap();
    this.map = mapContent.map;
  }

  scrollToBottom() {
    // https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
    // https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
    let scrolling_content = document.querySelector("#scrolling_content");
    scrolling_content.scrollTo(0, scrolling_content.scrollHeight);
  }  
}
