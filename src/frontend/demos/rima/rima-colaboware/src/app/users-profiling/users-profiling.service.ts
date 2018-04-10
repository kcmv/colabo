import { Injectable } from '@angular/core';

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

import {UserProfilingData} from './userProfilingData';

const MAP_ID = "f7baf6923c0c84b84f0d402a";

export enum ProfilingStateType {
  OFF = 'OFF',
  USER_ID = 'USER_ID',
  ATTRIBUTE = 'ATTRIBUTE'
}
const AttributesPerUser:number = 2;

@Injectable()
export class UsersProfilingService {
  // all edges in the map
  edges:KEdge[] = [];
  // all nodes in the map
  nodes:KNode[] = [];
  // all users in the map
  users:KNode[] = [];
  activeUser:KNode = null;

  // global event name that is sent by @colabo-colaboware/colaboware_rfid/ColabowareRFIDService when RFID card is pressed
  colabowareIDProvided:string = "colabowareIDProvided";

  ProfilingStateTypeNames:string[] = [
    'OFF',
    'USER_ID',
    'ATTRIBUTE'
  ];

  currentAttributeIndex:number =  0;

  profilingState: ProfilingStateType = ProfilingStateType.OFF;
  static SINISHA:boolean = true;

  constructor(
    private colabowareRFIDService: ColabowareRFIDService,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeMapService: KnalledgeMapService,
    private globalEmitterServicesArray: GlobalEmitterServicesArray
  ) {

    // load map nodes and edges
    this.getMapContent();

    // TODO: better to wait for the map got fully loaded
    // listen for RFID cards pressed
    this.globalEmitterServicesArray.register(this.colabowareIDProvided);

    if(UsersProfilingService.SINISHA) this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.colabowareInput.bind(this));
    else this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.selectUser.bind(this));
    // this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.createNewUser.bind(this));

  }

  // select user that matches the RFID card pressed
  selectUser(coLaboWareData:CoLaboWareData){
    for(var i=0; i<this.users.length; i++){
      var user = this.users[i];
      if(user.dataContent && user.dataContent.coLaboWareData && user.dataContent.coLaboWareData.value === coLaboWareData.value){
        this.activeUser = user;
        return this.activeUser;
      }
    }
    this.activeUser = null;
    return this.activeUser;
  }

  // create new user after RFID card is pressed
  createNewUser(newUserData:any, callback:Function=null){
    console.log("[createNewUser] newUserData: ", newUserData);
    let usersNode = this.getFirstNodeForType(KNode.TYPE_USERS);
    console.log("usersNode:", usersNode);

    // creating new user node
    let userNode:KNode = new KNode();
    userNode.mapId = MAP_ID;
    userNode.name = newUserData.name;
    userNode.type = KNode.TYPE_USER;
    // later to access the RFID value you would need to do:
    // let rfid = userNode.dataContent.coLaboWareData.value;
    userNode.dataContent = {
      coLaboWareData: newUserData.coLaboWareData,
      image: {
        url: newUserData.image.url
        // width: image.width,
        // height: image.height
      }
    }

    // creating edge between new user and users node (with type KNode.TYPE_USERS)
    let userEdge:KEdge = new KEdge();
    userEdge.mapId = MAP_ID;
    userEdge.name = "User";
    userEdge.type = KEdge.TYPE_USER;

    this.createNewNodeWithEdge(userNode, userEdge, usersNode._id, newUserCreated.bind(this));

    function newUserCreated(newUser:KNode, newUserEdge:KEdge){
      this.users.push(newUser);
      if(callback) callback(newUser, newUserEdge);
    }
  }

  profileNewUser():void
  {
    console.log('profileNewUser');
    this.profilingState = ProfilingStateType.USER_ID;
  }

  setUserId(id:string):void
  {
    console.log('setUserId');
    //TODO: +mprinc check if user exists
    this.createUser(id);
  }

  createUser(id:string):void{
    console.log('createUser');
    let user:KNode = new KNode();
    user.type = KNode.TYPE_USER;
    user.name = 'u_'+id;
    this.users.push(user);
    this.activeUser = user;
    console.log('this.activeUser:'+this.activeUser.name);
    let userProfilingData:UserProfilingData = new UserProfilingData();
    userProfilingData.rfid = id;
    user.dataContent.userProfilingData = userProfilingData;

    this.switchToAttributeSetting();
  }

  switchToAttributeSetting(){
    this.profilingState = ProfilingStateType.ATTRIBUTE; //after setting up user, we set up its attributes
    this.currentAttributeIndex = 0;
  }

  setUserAttribute(attrVal:string):void{
    console.log('setUserAttribute:' + attrVal);
    let userProfilingData:UserProfilingData = (<UserProfilingData>this.activeUser.dataContent.userProfilingData);
    userProfilingData.attributes[this.currentAttributeIndex++] = attrVal;

    if(this.currentAttributeIndex>=AttributesPerUser){
      this.profilingState = ProfilingStateType.USER_ID;
    }
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
      switch(this.profilingState){
        case ProfilingStateType.USER_ID:
          this.setUserId(cwData.value);
          break;
        case ProfilingStateType.ATTRIBUTE:
          this.setUserAttribute(cwData.value);
          break;

        case ProfilingStateType.OFF:
        default:
          break;
      }
    }
  }

  /** Code for dealing with maps, probably repetition from KnAllEdge code :(
  */

  createNewNodeWithEdge(newNode:KNode, newEdge:KEdge, parentNodeId:string, listener){
    newNode.iAmId = "556760847125996dc1a4a24f";
    newEdge.iAmId = "556760847125996dc1a4a24f";

    //TODO: iAmId, createdAt, updatedAt
    this.knalledgeNodeService.create(newNode)
    .subscribe(newNodeCreated.bind(this));

    // callback after the new user is created
    function newNodeCreated(newNode:KNode):void{
      console.log('newUserCreated', newNode);
      this.nodes.push(newNode);

      newEdge.sourceId = parentNodeId;
      newEdge.targetId = newNode._id;
      //TODO: iAmId, createdAt, updatedAt
      this.knalledgeEdgeService.create(newEdge)
      .subscribe(newEdgeCreated.bind(this));

      // callback after an edge to the new node is created
      function newEdgeCreated(newEdge:KEdge):void{
        console.log('newEdgeCreated', newEdge);
        listener(newNode, newEdge);
        this.edges.push(newEdge);
      }
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

  extractNodesOfType(type:string, extractedNodes:KNode[]){
    for(var i=0; i<this.nodes.length; i++){
      var node = this.nodes[i];
      if(node.type === type) extractedNodes.push(node);
    }
    return extractedNodes;
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

    this.users = [];
    this.extractNodesOfType(KNode.TYPE_USER, this.users);
  }

  edgesReceived(edgesS:Array<KEdge>):void{
    // this.edges = edgesS.data;
    //this.edges.fill(edgesS); //this.edges = edgesS.data;
    //this.edges.name = 'test';
    console.log('edges: ', edgesS);
    this.edges = edgesS;
  }

}
