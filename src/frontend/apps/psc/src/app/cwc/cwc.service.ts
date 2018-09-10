import { Injectable } from '@angular/core';

// In  Angular 6 / Rxjs 6 the import is like below
// import { Observable, of } from 'rxjs';

// but in Angular 5.2.x and Rxjs 5x is:
import { Observable } from 'rxjs';
import { of } from 'rxjs';

import {KMap} from '@colabo-knalledge/knalledge_core/code/knalledge/kMap';
import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';
import {RimaAAAService} from '@colabo-rima/rima_aaa/rima-aaa.service';

import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

//this consts are defined by INSTALL.MD data:
//const MAP_ID = "5b8a5260f8b8e40f3f250f9d"; //TEF
const MAP_ID = "5b49e7f736390f03580ac9a7"; //Forum Vlasina

export const CWC_TYPE:string = "rima.user.dream";
export const CWC_EDGE_NAME:string = "CWC dream";
//export const CWC_NODE_NAME:string = "CWC dream";

export const CWCS_TO_FILL:number = 3;

export class CWCData{
  cwcs: string[];
  // cwcsEn: string[]; //TODO

  constructor(cwcs:string[]){
    this.cwcs = cwcs;
  }
}

@Injectable()
export class CWCService {

  cwcsSavedObserver:any = {};//Observer
  CWCs:any[] = [];
  cwcsLeftSave:number = CWCS_TO_FILL;

  constructor(
    // private colabowareRFIDService: ColabowareRFIDService,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeMapService: KnalledgeMapService,
    private globalEmitterServicesArray: GlobalEmittersArrayService,
    private RimaAAAService: RimaAAAService
  ) {
    //getting data for the user:
    //this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.coLaboWareProvidedData.bind(this));
    this.init();
  }

  init():void{
    console.log('sDGsService.init');
  }

  createNewNodeWithEdge(newNode:KNode, newEdge:KEdge, parentNodeId:string, listener){
    newNode.iAmId = "556760847125996dc1a4a24f";
    newNode.visual = {};
    newEdge.iAmId = "556760847125996dc1a4a24f";
    newEdge.visual = {};

    //TODO: iAmId, createdAt, updatedAt
    this.knalledgeNodeService.create(newNode)
    .subscribe(newNodeCreated.bind(this));

    // callback after the new user is created
    function newNodeCreated(newNode:KNode):void{
      console.log('newUserCreated', newNode);
      this.activeUser = newNode;
      //this.nodes.push(newNode);

      newEdge.sourceId = parentNodeId;
      newEdge.targetId = newNode._id;
      newEdge.mapId = MAP_ID;
      //TODO: iAmId, createdAt, updatedAt
      this.knalledgeEdgeService.create(newEdge)
      .subscribe(newEdgeCreated.bind(this));

      // callback after an edge to the new node is created
      function newEdgeCreated(newEdge:KEdge):void{
        console.log('newEdgeCreated', newEdge);
        listener(newNode, newEdge);
        //this.edges.push(newEdge);
      }
    }
  }

  /*
  TO MOVE into some AppService or InitService or ....
    gets initial data for the app to work:
    - CWCs
    TODO: - user data
  */
  getAppData():void{

      //var map:KNode = new KNode();
      // this.heroService.getHero(id)
      //   .subscribe(hero => this.hero = hero);
      //this.node =
      this.getCWCs();
      // this.knalledgeEdgeService.queryInMap(MAP_ID)
      //   .subscribe(edges => this.edgesReceived(edges)); //as KNode
  }

  //loadCWCs():void{
  getCWCs():Observable<any[]>{
    //return of(this.CWCsMockup);
    return this.knalledgeNodeService.queryInMapofType(MAP_ID, CWC_TYPE); //TODO: by User
       //.subscribe(nodes => this.cwcsReceived(nodes)); //as KNode}
  }

  saveCWCs(cwcD:CWCData):Observable<any>{
    let user_id:string = this.RimaAAAService.getUserId();
    let cwc:string;
    this.cwcsLeftSave = cwcD.cwcs.length;
    let that = this;
    this.knalledgeEdgeService.destroyByTypeByUser(CWC_TYPE, user_id).subscribe(function(data:any){
      console.log('oldCWCEdgesDeleted', data);

      that.knalledgeNodeService.destroyByTypeByUser(CWC_TYPE, user_id).subscribe(function(data:any){
        console.log('oldCWCNodesDeleted', data);

        for (var i in cwcD.cwcs) {
          cwc = cwcD.cwcs[i];

          let cwcNode:KNode = new KNode();
          cwcNode.iAmId = user_id;
          cwcNode.mapId = MAP_ID;
          cwcNode.name = cwc;
          cwcNode.type = CWC_TYPE;
          that.knalledgeNodeService.create(cwcNode).subscribe(function(node:KNode){
            //nodesaved, now saving edges
            console.log('cwcNodeCreated', node);
            let cwcEdge:KEdge = new KEdge();
            cwcEdge.sourceId = user_id;
            cwcEdge.targetId = node._id;
            cwcEdge.iAmId = user_id;
            cwcEdge.mapId = MAP_ID;
            cwcEdge.name = CWC_EDGE_NAME;
            cwcEdge.type = CWC_TYPE;
            that.knalledgeEdgeService.create(cwcEdge).subscribe(that.cwcESaved.bind(that));
          });
        }
      });
    });
    // https://angular.io/guide/observables
    return new Observable(this.cwcsSavedSubscriber.bind(this));
  }

  //could be done as anonymous, but we made it this way to be more clear the logic of Oberver
  cwcsSavedSubscriber(observer) { //:Observer) {
    console.log('cwcsSavedSubscriber');
    this.cwcsSavedObserver = observer;
    return {unsubscribe() {}};
  }

  cwcESaved(edge:any):void{
    console.log('cwcEdgeCreated', edge);
    this.cwcsLeftSave--;
    console.log('CWCsService::cwcSaved:', this.cwcsLeftSave, edge);
    if(this.cwcsLeftSave === 0){
      console.log('CWCsService::ALL cwcSaved');

      //emitting Obstacle:
      this.cwcsSavedObserver.next(1); //TODO change value
      this.cwcsSavedObserver.complete();
    }
  }

  //getCWCs():Observable<KNode[]>{
  // getCWCs():any[]{
  //   return this.CWCs;
  // }

  /*
  //TODO: not used now:
  cwcsReceived(nodesS:Array<KNode>):void{
    // this.nodes = nodesS.data;
    //this.nodes.fill(nodesS); //this.nodes = nodesS.data;
    //this.nodes.name = 'test';
    this.CWCs= nodesS;

    console.log('[cwcsReceived] this.CWCs: ', this.CWCs);

    // this.users = [];
    // this.extractNodesOfType(KNode.TYPE_USER, this.users);
    //
    // this.tagsGroups = [];
    // this.extractNodesOfType(KNode.TYPE_TAGS_GROUP, this.tagsGroups);
    // this.tags = [];
    // this.extractNodesOfType(KNode.TYPE_TAG, this.tags);
    // this.groups = [];
    // this.extractNodesOfType(KNode.TYPE_USERS_GROUP, this.groups);
  }
  */
}
