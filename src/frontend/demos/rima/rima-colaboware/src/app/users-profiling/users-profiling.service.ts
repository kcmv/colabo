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

export enum Roles {
  REFUGEE = 1,
  LOCAL = 2,
  ACTIVIST = 3
}

export enum RolesRFIDs {
  REFUGEE = '0009705484',
  LOCAL = '0009672284',
  ACTIVIST = '0009671736'
}

const userRFIDs:string[] =
['0009892855', '0009893200', '0009610151', '0009706236', '0009610890', '0009725754', '0009593526', '0009593216', '0009608698', '0009595428',
'0009894227', '0009705858', '0009610521', '0009707369', '0009609424', '0003739519', '0003701999', '0003736478', '0003736516', '0009671466',
'0009669671', '0009669921', '0009596702', '0009669427', '0009597653', '0009592905', '0009669183', '0003701945', '0009597019', '0003739495',
'0009726100'];

const attributes:string[][] = [['0009609788', '0009597333', '0009668945'], ['0003739468', '0003678978', '0003736466']];

export const AttributesPerUser:number = 2;

@Injectable()
export class UsersProfilingService {
  // all edges in the map
  edges:KEdge[] = [];
  // all nodes in the map
  nodes:KNode[] = [];
  // all users in the map
  users:KNode[] = [];
  activeUser:KNode = null;
  // all tag groups in the map
  tagsGroups:KNode[] = [];
  tags:KNode[] = [];
  interests:KEdge[] = [];
  RFIDreport:string;

  // global event name that is sent by @colabo-colaboware/colaboware_rfid/ColabowareRFIDService when RFID card is pressed
  colabowareIDProvided:string = "colabowareIDProvided";

  ProfilingStateTypeNames:string[] = [
    'OFF',
    'USER_ID',
    'ATTRIBUTE'
  ];

  currentAttributeIndex:number =  0;

  profilingState: ProfilingStateType = ProfilingStateType.OFF;
  static SINISHA:boolean = false;

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
    else
    // this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.selectUserByCoLaboWare.bind(this));
    this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.coLaboWareProvidedData.bind(this));

  }

  getUserById(id:string):KNode{
    for (var i=0;i<this.users.length;i++){
      if(this.users[i]._id === id){
        return this.users[i];
      }
    }
    return null;
  }

  fillDemoUsers(set:number=1):void{
    let demoAttributes:number[][] = [];
    switch(set){
      case 1:
        //roles:            R:1   L:2  A:3   R:1   L:2  A:3     R:1   L:2  A:3
        demoAttributes = [[0,0],[0,0],[0,1],[2,2],[1,1],[1,2],[1,1],[3,2],[3,4]];
        this.users = [];
        for (var i=0;i<9;i++){
          let user:KNode = new KNode();
          user.type = KNode.TYPE_USER;
          user.name = user.name = 'u_'+ userRFIDs[i];
          // later to access the RFID value you would need to do:
          // let rfid = userNode.dataContent.coLaboWareData.value;

          let role:number = Roles.REFUGEE;
          switch(i%3){
            case 0:
              role = Roles.REFUGEE;
              break;
            case 1:
              role = Roles.LOCAL;
              break;
            case 2:
              role = Roles.ACTIVIST;
              break;
          }

          user.dataContent = {
            userProfilingData: new UserProfilingData(userRFIDs[i], [attributes[0][demoAttributes[i][0]], attributes[1][demoAttributes[i][1]]], role),
            coLaboWareData: null,
            image: {
              url: ""
              // width: image.width,
              // height: image.height
            }
          }
          this.users.push(user);
        }
      break;
    }
    console.log('users:'+this.users);
  }

  coLaboWareProvidedData(coLaboWareData:CoLaboWareData){
    let user;
    let tag;

    user = this.getUserByCoLaboWare(coLaboWareData);
    if(user){
      this.activeUser = user;
      this.RFIDreport = "Active user: " + this.activeUser.name;
    }else{
      tag = this.getTagByCoLaboWare(coLaboWareData);
      if(tag){
        this.RFIDreport = "Tag: " + tag.name;
        if(this.activeUser){
          this.switchTagAssociationForUser(this.activeUser, tag);
        }
      }else{
        this.RFIDreport = "Unknown RFID";
      }
    }
  }
  // select user that matches the RFID card pressed
  selectUserByCoLaboWare(coLaboWareData:CoLaboWareData){
    this.activeUser = this.getUserByCoLaboWare(coLaboWareData);
    return this.activeUser;
  }

  getUserByCoLaboWare(coLaboWareData:CoLaboWareData){
    for(var i=0; i<this.users.length; i++){
      var user = this.users[i];
      if(user.dataContent && user.dataContent.coLaboWareData && user.dataContent.coLaboWareData.value === coLaboWareData.value){
        return user;
      }
    }
    return null;
  }
  // get tag that matches the RFID card pressed
  getTagByCoLaboWare(coLaboWareData:CoLaboWareData){
    for(var i=0; i<this.tags.length; i++){
      var tag = this.tags[i];
      if(tag.dataContent && tag.dataContent.coLaboWareData && tag.dataContent.coLaboWareData.value === coLaboWareData.value){
        return tag;
      }
    }
    return null;
  }

  switchTagAssociationForUser(user:KNode, tag:KNode){
    let edge = this.getEdgeBetweenNodes(user, tag);

    function edgeCreated(edge:KEdge):void{
      console.log('edgeCreated');
      console.log(edge);
      this.edges.push(edge);
      this.interests.push(edge);
    }

    function edgeDeleted(success:boolean){
      if(success){
        let edge_id:string = edge._id;
        this.edges = this.edges.filter(h => h._id !== edge_id);
        this.interests = this.interests.filter(h => h._id !== edge_id);
      }
    }

    if(edge){
      let edge_id:string = edge._id;
      this.knalledgeEdgeService.destroy(edge_id).subscribe(edgeDeleted.bind(this));
    }else{
      let edge:KEdge = new KEdge();
      //TODO:NG2: add Demo User at the beginning and use Demo Map Id
      edge.iAmId = '556760847125996dc1a4a24f';
      edge.mapId = MAP_ID; //'56ebeabb913d88af03e9d2d6' //TODO:NG2 - use 'Demo Map' id
      edge.name = "Interest";
      edge.type = KEdge.TYPE_USER_INTEREST;
      edge.sourceId = user._id;
      edge.targetId = tag._id;
      //TODO: iAmId, createdAt, updatedAt
      this.knalledgeEdgeService.create(edge)
      .subscribe(edgeCreated.bind(this));
    }
  }

  // create new user
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

  // create new tags group
  createNewTagsGroup(newTagsGroupData:any, callback:Function=null){
    console.log("[createNewTagsGroup] newTagsGroupData: ", newTagsGroupData);
    let parentTagsGroupNode;
    if(newTagsGroupData.parentTagsGroup){
      parentTagsGroupNode = this.getFirstNodeForNameAndType(newTagsGroupData.parentTagsGroup, KNode.TYPE_TAGS_GROUP);
    }else{
      parentTagsGroupNode = this.getFirstNodeForType(KNode.TYPE_TAGS);
    }
    console.log("parentTagsGroupNode:", parentTagsGroupNode);

    // creating new tagsGroup node
    let tagsGroupNode:KNode = new KNode();
    tagsGroupNode.mapId = MAP_ID;
    tagsGroupNode.name = newTagsGroupData.name;
    tagsGroupNode.type = KNode.TYPE_TAGS_GROUP;
    // later to access the RFID value you would need to do:
    // let rfid = tagsGroupNode.dataContent.coLaboWareData.value;
    tagsGroupNode.dataContent = {
      image: {
        url: newTagsGroupData.image.url
        // width: image.width,
        // height: image.height
      }
    }

    // creating edge between new tagsGroup and tagsGroups node (with type KNode.TYPE_USERS)
    let tagsGroupEdge:KEdge = new KEdge();
    tagsGroupEdge.mapId = MAP_ID;
    tagsGroupEdge.name = "TagsGroup";
    tagsGroupEdge.type = KEdge.TYPE_TAGS_GROUP;

    this.createNewNodeWithEdge(tagsGroupNode, tagsGroupEdge, parentTagsGroupNode._id, newTagsGroupCreated.bind(this));

    function newTagsGroupCreated(newTagsGroup:KNode, newTagsGroupEdge:KEdge){
      this.tagsGroups.push(newTagsGroup);
      if(callback) callback(newTagsGroup, newTagsGroupEdge);
    }
  }

  // create new tag
  createNewTag(newTagData:any, callback:Function=null){
    console.log("[createNewTag] newTagData: ", newTagData);
    let tagsGroupNode;
    if(newTagData.tagGroup){
      tagsGroupNode = this.getFirstNodeForNameAndType(newTagData.tagGroup, KNode.TYPE_TAGS_GROUP);
    }else{
      tagsGroupNode = this.getFirstNodeForType(KNode.TYPE_TAGS);
    }
    console.log("tagsGroupNode:", tagsGroupNode);

    // creating new tag node
    let tagNode:KNode = new KNode();
    tagNode.mapId = MAP_ID;
    tagNode.name = newTagData.name;
    tagNode.type = KNode.TYPE_TAG;
    // later to access the RFID value you would need to do:
    // let rfid = tagNode.dataContent.coLaboWareData.value;
    tagNode.dataContent = {
      coLaboWareData: newTagData.coLaboWareData,
      image: {
        url: newTagData.image.url
        // width: image.width,
        // height: image.height
      }
    }

    // creating edge between new tag and tags node (with type KNode.TYPE_USERS)
    let tagEdge:KEdge = new KEdge();
    tagEdge.mapId = MAP_ID;
    tagEdge.name = "Tag";
    tagEdge.type = KEdge.TYPE_TAG;

    this.createNewNodeWithEdge(tagNode, tagEdge, tagsGroupNode._id, newTagCreated.bind(this));

    function newTagCreated(newTag:KNode, newTagEdge:KEdge){
      this.tags.push(newTag);
      if(callback) callback(newTag, newTagEdge);
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

  /**
  get all children nodes of a parentNode of a type childrenType, that are connected with the nodeOfInterest
  */
  getChildrenNodeConnectedToNodeOfInterest(nodeOfInterest:KNode, childrenType:string, parentNode:KNode):KNode[]{
    let connectedChildNodes:KNode[] = [];
    // go through all nodes and find relevant children
    for(var i=0; i<this.nodes.length; i++){
      let child = this.nodes[i];
      if(child.type !== childrenType) continue;
      if(!this.isChildNode(parentNode, child)) continue;

      // OK, it is a child of parentNode and of type childrenType
      // let's see if it is connected with the nodeOfInterest
      if(this.areNodesConnected(nodeOfInterest, child)) connectedChildNodes.push(child);
    }

    return connectedChildNodes;
  }

  isChildNode(parentNode:KNode, node:KNode):boolean{
    for(var i=0; i<this.edges.length; i++){
      var edge = this.edges[i];
      if(edge.sourceId === parentNode._id && edge.targetId === node._id) return true;
    }
    return false;
  }

  getEdgeBetweenNodes(sourceNode:KNode, targetNode:KNode):KEdge{
    for(var i=0; i<this.edges.length; i++){
      var edge = this.edges[i];
      if(edge.sourceId === sourceNode._id && edge.targetId === targetNode._id) return edge;
    }
    return null;
  }

  areNodesConnected(sourceNode:KNode, targetNode:KNode):boolean{
    for(var i=0; i<this.edges.length; i++){
      var edge = this.edges[i];
      if(edge.sourceId === sourceNode._id && edge.targetId === targetNode._id) return true;
    }
    return false;
  }

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

  // get the first (if there are many) node that has the provided type
  getFirstNodeForType(type:string){
    for(var i=0; i<this.nodes.length; i++){
      var node = this.nodes[i];
      if(node.type === type) return node;
    }
    return null;
  }
  // get the first (if there are many) node that has the provided name and type
  getFirstNodeForNameAndType(name:string, type:string){
    for(var i=0; i<this.nodes.length; i++){
      var node = this.nodes[i];
      if(node.type === type && node.name === name) return node;
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

  extractEdgesOfType(type:string, extractedEdges:KEdge[]){
    for(var i=0; i<this.edges.length; i++){
      var edge = this.edges[i];
      if(edge.type === type) extractedEdges.push(edge);
    }
    return extractedEdges;
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

    this.tagsGroups = [];
    this.extractNodesOfType(KNode.TYPE_TAGS_GROUP, this.tagsGroups);
    this.tags = [];
    this.extractNodesOfType(KNode.TYPE_TAG, this.tags);
  }

  edgesReceived(edgesS:Array<KEdge>):void{
    // this.edges = edgesS.data;
    //this.edges.fill(edgesS); //this.edges = edgesS.data;
    //this.edges.name = 'test';
    console.log('edges: ', edgesS);
    this.edges = edgesS;

    this.extractEdgesOfType(KEdge.TYPE_USER_INTEREST, this.interests);
  }

}
