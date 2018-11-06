import { Component, ReflectiveInjector, Injector, Inject, Optional, 
  NgModule, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {MaterialModule} from '../materialModule';
import { GlobalEmittersArrayService } from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';
import {KnalledgeViewComponent} from '@colabo-knalledge/f-view_enginee/knalledgeView.component';

/**
 * the namespace for core services for the KnAllEdge system
 * @namespace knalledge.knalledgeMap.knalledgeMapDirectives
 */

@Component({
  selector: 'colabo-knalledge-map',
  templateUrl: './map.component.tpl.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, AfterViewInit, OnDestroy{
  public title: string = 'FDB Graph';
  public selectedNodeChangedEvent = "selectedNodeChangedEvent";
  @ViewChild(KnalledgeViewComponent) public knalledgeViewComponent: KnalledgeViewComponent;
  private Plugins: any;
  private GlobalEmittersArrayService:any;
  private genderSelected:any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ng2injector: Injector
  ) {
    this.Plugins = this.ng2injector.get('Plugins', null);
    this.GlobalEmittersArrayService = this.ng2injector.get(GlobalEmittersArrayService, null);
  }

  getInitialParams() {
      const search = this.activatedRoute.snapshot.paramMap.get('search');
      console.log("[KnalledgeViewComponent] search: ", search);
  }

  ngOnInit() {
    this.getInitialParams();
    this.GlobalEmittersArrayService.register(this.selectedNodeChangedEvent);
    this.GlobalEmittersArrayService.get(this.selectedNodeChangedEvent).subscribe('graphMain.component', vkNode => {
      var name = vkNode ? vkNode.kNode.name : null;
    });
  }

  ngAfterViewInit(){
    this.initContent();
  }

  ngOnDestroy() {
  }

  initContent(){
    const selectedNode = { "_id": "575c7c1e49dc3cda62624ca0", "name": "Performative DialoGame", "type": "knalledge", 
      "mapId": "575c7c1e49dc3cda62624ca1", "iAmId": "556760847125996dc1a4a241", "version": 1, "activeVersion": 1, "ideaId": 0,
      "isPublic": true, "createdAt": "2016-06-11T21:01:18.115Z", "updatedAt": "2016-06-11T21:01:18.131Z", "decorations": {}, "up": {},
      "visual": { "isOpen": true, "xM": 0, "yM": 0 }, "state": "STATE_SYNCED", 
      "dataContent": { "ibis": { "votes": { "556760847125996dc1a4a241": 2 } } } };
     let mockupMap = {
       selectedNode: selectedNode,
      map: {
        nodes:
          [
            selectedNode,
            {"_id":"575d225d16206451e6e82c68","name":"Nikola Tesla","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
            "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
            "createdAt":"2016-06-12T08:50:37.160Z","updatedAt":"2016-06-12T08:50:37.160Z","decorations":{},"up":{},
            "visual":{"isOpen":true},"state":"STATE_SYNCED"},
            {"_id":"575de27c16206451e6e82ca0","name":"participants","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
            "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
            "createdAt":"2016-06-12T22:30:20.632Z","updatedAt":"2016-06-12T22:30:20.633Z","decorations":{},"up":{},
            "visual":{"isOpen":false},"state":"STATE_SYNCED","dataContent":{"ibis":{"votes":{"556760847125996dc1a4a241":-1}}}},
            {"_id":"575de2ca16206451e6e82ca2","name":"SDGs","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
            "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
            "createdAt":"2016-06-12T22:31:38.500Z","updatedAt":"2016-06-12T22:31:38.501Z","decorations":{},"up":{},
            "visual":{"isOpen":false},"state":"STATE_SYNCED","dataContent":{"ibis":{"votes":{"556760847125996dc1a4a241":1}}}},
            {"_id":"575de2d816206451e6e82ca4","name":"1. No Powerty","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
            "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
            "createdAt":"2016-06-12T22:31:52.517Z","updatedAt":"2016-06-12T22:31:52.518Z","decorations":{},"up":{},
            "visual":{"isOpen":false},"state":"STATE_SYNCED"},
            {
              "_id": "575de2d816206451e6e82cab", "name": "7. Affordable and Clean Energy", "type": "type_knowledge", 
              "mapId": "575c7c1e49dc3cda62624ca1",
              "iAmId": "556760847125996dc1a4a241", "version": 1, "activeVersion": 1, "ideaId": 0, "isPublic": true,
              "createdAt": "2016-06-12T22:31:52.517Z", "updatedAt": "2016-06-12T22:31:52.518Z", "decorations": {}, "up": {},
              "visual": { "isOpen": false }, "state": "STATE_SYNCED"
            },
            {
              "_id": "575de2e516206451e6e82ca6", "name":"I want to not split the plum with sister"
              ,"type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
              "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
              "createdAt":"2016-06-12T22:32:05.593Z","updatedAt":"2016-06-12T22:32:05.594Z","decorations":{},"up":{},
              "visual":{"isOpen":false},"state":"STATE_SYNCED"},
            {"_id":"5a099368601bc40675d6ec5e","name":"A girl with matches","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
            "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
            "createdAt":"2017-11-13T12:43:20.988Z","updatedAt":"2017-11-13T12:43:20.991Z","decorations":{},"up":{},
            "visual":{"isOpen":false},"state":"STATE_SYNCED"},
            {"_id":"5a09938ccdfd0ae7780fc350","name":"Tesla's Wireless Energy","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
            "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
            "createdAt":"2017-11-13T12:43:56.768Z","updatedAt":"2017-11-13T12:43:56.773Z","decorations":{},"up":{},
            "visual":{"isOpen":false},"state":"STATE_SYNCED"}],
        edges: [
          {"_id":"575de27c16206451e6e82ca1","name":"","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
          "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
          "createdAt":"2016-06-12T22:30:20.804Z","updatedAt":"2016-06-12T22:30:20.805Z","sourceId":"575c7c1e49dc3cda62624ca0",
          "targetId":"575de27c16206451e6e82ca0","dataContent":null,"value":0,"up":{},"visual":null,"state":"STATE_SYNCED"},
          {"_id":"575de2ca16206451e6e82ca3","name":"","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
          "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
          "createdAt":"2016-06-12T22:31:38.693Z","updatedAt":"2016-06-12T22:31:38.698Z","sourceId":"575c7c1e49dc3cda62624ca0",
          "targetId":"575de2ca16206451e6e82ca2","dataContent":null,"value":0,"up":{},"visual":null,"state":"STATE_SYNCED"},
          {"_id":"575de2d816206451e6e82ca5","name":"","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
          "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
          "createdAt":"2016-06-12T22:31:52.819Z","updatedAt":"2016-06-12T22:31:52.820Z","sourceId":"575de2ca16206451e6e82ca2",
          "targetId":"575de2d816206451e6e82ca4","dataContent":null,"value":0,"up":{},"visual":null,"state":"STATE_SYNCED"},
          {
            "_id": "575de2d816206451e6e82cab", "name": "", "type": "type_knowledge", "mapId": "575c7c1e49dc3cda62624ca1",
            "iAmId": "556760847125996dc1a4a241", "version": 1, "activeVersion": 1, "ideaId": 0, "isPublic": true,
            "createdAt": "2016-06-12T22:31:52.819Z", "updatedAt": "2016-06-12T22:31:52.820Z", "sourceId": "575de2ca16206451e6e82ca2",
            "targetId": "575de2d816206451e6e82cab", "dataContent": null, "value": 0, "up": {}, "visual": null, "state": "STATE_SYNCED"
          },
          {"_id":"575de2e616206451e6e82ca7","name":"","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
          "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
          "createdAt":"2016-06-12T22:32:06.052Z","updatedAt":"2016-06-12T22:32:06.053Z","sourceId":"575de2d816206451e6e82ca4",
          "targetId":"575de2e516206451e6e82ca6","dataContent":null,"value":0,"up":{},"visual":null,"state":"STATE_SYNCED"},
          {"_id":"5a099369601bc40675d6ec60","name":"","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
          "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
          "createdAt":"2017-11-13T12:43:21.130Z","updatedAt":"2017-11-13T12:43:21.132Z","sourceId":"575de2d816206451e6e82ca4",
          "targetId":"5a099368601bc40675d6ec5e","dataContent":null,"value":0,"up":{},"visual":null,"state":"STATE_SYNCED"},
          {"_id":"5a09938ccdfd0ae7780fc352","name":"","type":"type_knowledge","mapId":"575c7c1e49dc3cda62624ca1",
          "iAmId":"556760847125996dc1a4a241","version":1,"activeVersion":1,"ideaId":0,"isPublic":true,
            "createdAt": "2017-11-13T12:43:56.909Z", "updatedAt": "2017-11-13T12:43:56.911Z", "sourceId":"575de2d816206451e6e82cab",
          "targetId":"5a09938ccdfd0ae7780fc350","dataContent":null,"value":0,"up":{},"visual":null,"state":"STATE_SYNCED"},
          {
            "_id": "5a09938ccdfd0ae7780fc357", "name": "", "type": "type_knowledge", "mapId": "575c7c1e49dc3cda62624ca1",
            "iAmId": "556760847125996dc1a4a241", "version": 1, "activeVersion": 1, "ideaId": 0, "isPublic": true,
            "createdAt": "2017-11-13T12:43:56.909Z", "updatedAt": "2017-11-13T12:43:56.911Z", "sourceId": "575de27c16206451e6e82ca0",
            "targetId": "575d225d16206451e6e82c68", "dataContent": null, "value": 0, "up": {}, "visual": null, "state": "STATE_SYNCED"
          }

          
          
        ],
        },
        properties:{
          "_id":"575c7c1e49dc3cda62624ca1","name":"mini-test","rootNodeId":"575c7c1e49dc3cda62624ca0","type":"cf",
          "iAmId":"556760847125996dc1a4a241","ideaId":0,"activeVersion":1,"version":1,"parentMapId":"",
          "participants":["556760847125996dc1a4a241"],"isPublic":true,"createdAt":"2016-06-11T21:01:18.300Z",
          "updatedAt":"2016-06-19T14:16:21.682Z","dataContent":{"mcm":{"authors":"S.Rudan"}},"visual":{},"state":"STATE_SYNCED"
        }
    };
    this.knalledgeViewComponent.setData(mockupMap);
  }
}