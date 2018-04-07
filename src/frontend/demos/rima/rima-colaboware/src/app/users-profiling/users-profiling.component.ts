import { Component, OnInit, Input } from '@angular/core';

import {KMap} from '@colabo-knalledge/knalledge_core/code/knalledge/kMap';
import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';

import { CoLaboWareType } from '@colabo-colaboware/colaboware_core/coLaboWareData';
import { CoLaboWareData } from '@colabo-colaboware/colaboware_core/coLaboWareData';

import {ColabowareRFIDService} from '@colabo-colaboware/colaboware_rfid/ColabowareRFIDService';

import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

const MAP_ID = "f7baf6923c0c84b84f0d402a";

@Component({
  selector: 'app-users-profiling',
  templateUrl: './users-profiling.component.html',
  styleUrls: ['./users-profiling.component.css']
})
export class UsersProfilingComponent implements OnInit {
  edges:KEdge[] = [];
  nodes:KNode[] = [];
  // global event name that is sent by @colabo-colaboware/colaboware_rfid/ColabowareRFIDService when RFID card is pressed
  colabowareIDProvided:string = "colabowareIDProvided";

  @Input() new_user_name:string;

  constructor(
    private colabowareRFIDService: ColabowareRFIDService,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeMapService: KnalledgeMapService,
    private globalEmitterServicesArray: GlobalEmitterServicesArray
  ) { }

  ngOnInit() {
    this.new_user_name = 'Unicorn';

    // load map nodes and edges
    this.getMapContent();

    // TODO: better to wait for the map got fully loaded
    // listen for RFID cards pressed
    this.globalEmitterServicesArray.register(this.colabowareIDProvided);

    this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.createNewUser.bind(this));
  }

  // create new user after RFID card is pressed
  createNewUser(coLaboWareData){
    console.log("[createNewUser] New user id provided: ", coLaboWareData);
    let usersNode = this.getFirstNodeForType(KNode.TYPE_USERS);
    console.log("usersNode:", usersNode);

    // creating new user node
    let userNode:KNode = new KNode();
    userNode.mapId = MAP_ID; //'56ebeabb913d88af03e9d2d6' //TODO:NG2 - use 'Demo Map' id
    userNode.name = this.new_user_name;
    userNode.type = KNode.TYPE_USER;
    userNode.iAmId = "556760847125996dc1a4a24f";
    // later to access the RFID you would need to do:
    // let rfid = userNode.dataContent.coLaboWareData.value;
    userNode.dataContent = {
      coLaboWareData: coLaboWareData
    }
    //TODO: iAmId, createdAt, updatedAt
    this.knalledgeNodeService.create(userNode)
    .subscribe(newUserCreated.bind(this));

    // callback after the new user is created
    function newUserCreated(userNode:KNode):void{
      console.log('newUserCreated', userNode);
      this.nodes.push(userNode);

      // creating edge between new user and node with type KNode.TYPE_USERS
      let userEdge:KEdge = new KEdge();
      userEdge.mapId = MAP_ID;
      userEdge.name = "User";
      userEdge.iAmId = "556760847125996dc1a4a24f";
      userEdge.type = KEdge.TYPE_USER;
      userEdge.sourceId = usersNode._id;
      userEdge.targetId = userNode._id;
      //TODO: iAmId, createdAt, updatedAt
      this.knalledgeEdgeService.create(userEdge)
      .subscribe(userEdgeCreated.bind(this));
    }

    // callback after an edge to the new user is created
    function userEdgeCreated(userEdge:KEdge):void{
      console.log('userEdgeCreated', userEdge);
      this.edges.push(userEdge);
    }
  }

  // get first (if there are many) node that has the provided type
  getFirstNodeForType(type:string){
    for(var i=0; i<this.nodes.length; i++){
      var node = this.nodes[i];
      if(node.type === type) return node;
    }
    return null;
  }

  // get map nodes and edges
  getMapContent():void{
      //var map:KNode = new KNode();
      // this.heroService.getHero(id)
      //   .subscribe(hero => this.hero = hero);
      //this.node =
      this.knalledgeNodeService.queryInMap(MAP_ID)
        .subscribe(nodes => this.nodesReceived(nodes)); //as KNode
      this.knalledgeEdgeService.queryInMap(MAP_ID)
        .subscribe(edges => this.edgesReceived(edges)); //as KNode
  }

  nodesReceived(nodesS:Array<KNode>):void{
    // this.nodes = nodesS.data;
    //this.nodes.fill(nodesS); //this.nodes = nodesS.data;
    //this.nodes.name = 'test';
    console.log('nodes: ', nodesS);
    this.nodes = nodesS;
  }

  edgesReceived(edgesS:Array<KEdge>):void{
    // this.edges = edgesS.data;
    //this.edges.fill(edgesS); //this.edges = edgesS.data;
    //this.edges.name = 'test';
    console.log('edges: ', edgesS);
    this.edges = edgesS;
  }

  profileNewUser():void
  {
    console.log('profileNewUser');
  }

  inputUserProfile():void{
  }

  sendDemoColabowareInput():void{
      let cwData = new CoLaboWareData();
      cwData.type = CoLaboWareType.RFID;
      cwData.value = '0009610521';
      this.colabowareInput(cwData);
  }

  rfidEnable(){
    this.colabowareRFIDService.enable();
  }

  rfidDisable(){
    this.colabowareRFIDService.disable();
  }

  colabowareInput(cwData:CoLaboWareData){
    if(cwData.type === CoLaboWareType.RFID){
        console.log('RFID cwData:'+cwData.value);
    }
  }

}
